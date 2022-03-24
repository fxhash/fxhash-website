import style from "./StepAuthoring.module.scss"
import layout from "../../styles/Layout.module.scss"
import colors from "../../styles/Colors.module.css"
import cs from "classnames"
import { StepComponent } from "../../types/Steps"
import { useContext, useEffect, useMemo, useState } from "react"
import { Formik } from "formik"
import useFetch, { CachePolicies } from "use-http"
import { MetadataError, MetadataResponse } from "../../types/Responses"
import { CaptureSettings, GenerativeTokenMetadata } from "../../types/Metadata"
import { CaptureMode, CaptureTriggerMode, GenTokenInformationsForm } from "../../types/Mint"
import { Form } from "../../components/Form/Form"
import { Field } from "../../components/Form/Field"
import { InputText } from "../../components/Input/InputText"
import { Spacing } from "../../components/Layout/Spacing"
import { InputTextarea } from "../../components/Input/InputTextarea"
import { Fieldset } from "../../components/Form/Fieldset"
import { Checkbox } from "../../components/Input/Checkbox"
import { Button } from "../../components/Button"
import { InputTextUnit } from "../../components/Input/InputTextUnit"
import { getIpfsSlash } from "../../utils/ipfs"
import { UserContext } from "../UserProvider"
import { useContractCall } from "../../utils/hookts"
import { MintGenerativeCallData } from "../../types/ContractCalls"
import { ContractFeedback } from "../../components/Feedback/ContractFeedback"
import { getMutezDecimalsNb, isPositive } from "../../utils/math"
import { tagsFromString } from "../../utils/strings"
import { stringToByteString } from "../../utils/convert"
import { IOptions, Select } from "../../components/Input/Select"
import { useQuery } from "@apollo/client"
import { Qu_userCollaborations } from "../../queries/user"
import { InputMultiList, MultiListItem, MultiListItemProps } from "../../components/Input/InputMultiList"
import { Collaboration } from "../../types/entities/User"
import { UserBadge } from "../../components/User/UserBadge"
import { format } from "date-fns"
import { CollaborationCreate } from "../Collaborations/CollaborationCreate"
import { UserFromAddress } from "../../components/User/UserFromAddress"


const authoringOptions: IOptions[] = [
  {
    label: "yourself",
    value: 0,
  },
  {
    label: "other creators and yourself (collaboration)",
    value: 1,
  }
]

interface IMultiListItemProps extends MultiListItemProps {
  itemProps: {
    collab: Collaboration
    fresh: boolean
  }
}

export const StepAuthoring: StepComponent = ({ state, onNext }) => {
  const userCtx = useContext(UserContext)
  const user = userCtx.user!

  // query the user collaboration contracts in prevision
  const { data, loading } = useQuery(Qu_userCollaborations, {
    variables: {
      id: user.id
    }
  })

  // 0: user, 1: collaboration
  const [authorType, setAuthorType] = useState<number>(
    state.collaboration == null ? 0 : 1
  )

  // the selected collaboration address
  const [selectedCollab, setSelectedCollab] = useState<string|undefined>(
    state.collaboration !== null ? state.collaboration : undefined
  )

  // extract collaborations from data
  const collaborations = useMemo<Collaboration[]>(() => {
    if (!data || !data.user || !data.user.collaborationContracts) {
      return []
    }
    else {
      return data.user.collaborationContracts
    }
  }, [data])

  // a list of the collaborations created on-demand with the module
  const [createdCollabs, setCreatedCollabs] = useState<Collaboration[]>([])

  // build the list items from the collaboration contract
  const collaborationsListItem = useMemo<MultiListItem[]>(() => {
    return [
      ...createdCollabs.map(collab => ({
        value: collab.id,
        props: {
          collab: collab,
          fresh: true,
        }
      })),
      ...collaborations.map(collab => ({
        value: collab.id,
        props: {
          collab: collab,
          fresh: false,
        }
      }))
    ]
  }, [collaborations, createdCollabs])

  const handleSubmit = (evt: any) => {
    evt.preventDefault()
    onNext({
      collaboration: authorType === 0 ? null : selectedCollab,
    })
  }

  const onCreateCollab = (collab: Collaboration) => {
    setCreatedCollabs([
      collab,
      ...createdCollabs,
    ])
    setSelectedCollab(collab.id)
  }

  // can we go to the next step ?
  const isValid = authorType === 0 || !!selectedCollab

  return (
    <div className={cs(style.container)}>
      <Spacing size="6x-large"/>

      <Form className={cs(layout.smallform, style.form)} onSubmit={handleSubmit}>
        <Field>
          <label htmlFor="authoring-type">
            Who's authoring the piece ?
          </label>
          <Select
            id="authoring-type"
            name="authoring-type"
            placeholder="Who's authoring the piece ?"
            value={authorType}
            options={authoringOptions}
            onChange={setAuthorType}
            className={cs(style.select)}
          />
        </Field>

        {authorType === 1 && (
          <>
            <Field>
              <label>
                Select the collaboration
              </label>
              <InputMultiList<string>
                listItems={collaborationsListItem}
                selected={selectedCollab ? [ selectedCollab ] : []}
                onChangeSelected={(collab) => {
                  if (collab.length > 0) {
                    setSelectedCollab(collab[0])
                  }
                  else {
                    setSelectedCollab(undefined)
                  }
                }}
                multiple={false}
                className={cs(style.multilist)}
                btnClassName={cs(style.multilist_item)}
              >
                {({ selected, itemProps }: IMultiListItemProps) => (
                  <div className={cs(style.collab)}>
                    <span className={cs(style.address)}>
                      {itemProps.collab.id}
                    </span>
                    <div className={cs(style.users)}>
                      {itemProps.collab.collaborators.map(user => (
                        itemProps.fresh ? (
                          <UserFromAddress
                            key={user.id}
                            address={user.id}
                          >
                            {({ user }) => (
                              <UserBadge
                                size="small"
                                user={user}
                                hasLink={false}
                              />
                            )}
                          </UserFromAddress>
                        ):(
                          <UserBadge
                            key={user.id}
                            size="small"
                            user={user}
                            hasLink={false}
                          />
                        )
                      ))}
                    </div>
                    <span className={cs(style.date)}>
                      <strong>Created on: </strong>
                      <span>
                        {format(new Date(itemProps.collab.createdAt), "dd/MM/yyyy' at 'HH:mm")}
                      </span>
                    </span>
                  </div>
                )}
              </InputMultiList>
            </Field>
            
            <Spacing size="regular"/>
            <CollaborationCreate
              onCreate={onCreateCollab}
              hideOnCreate
            />
          </>
        )}

        <Spacing size="6x-large"/>

        <Button
          type="submit"
          color="secondary"
          size="large"
          disabled={!isValid}
        >
          next step
        </Button>
      </Form>

      <Spacing size="3x-large"/>
      <Spacing size="3x-large"/>
      <Spacing size="3x-large"/>
    </div>
  )
}