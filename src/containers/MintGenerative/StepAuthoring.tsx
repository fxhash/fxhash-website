import style from "./StepAuthoring.module.scss"
import layout from "../../styles/Layout.module.scss"
import colors from "../../styles/Colors.module.css"
import cs from "classnames"
import { StepComponent } from "../../types/Steps"
import { useContext, useEffect, useMemo, useState } from "react"
import { Form } from "../../components/Form/Form"
import { Field } from "../../components/Form/Field"
import { Spacing } from "../../components/Layout/Spacing"
import { Button } from "../../components/Button"
import { UserContext } from "../UserProvider"
import { IOptions, Select } from "../../components/Input/Select"
import { useQuery } from "@apollo/client"
import { Qu_userCollaborations } from "../../queries/user"
import {
  InputMultiList,
  MultiListItem,
  MultiListItemProps,
} from "../../components/Input/InputMultiList"
import { Collaboration } from "../../types/entities/User"
import { UserBadge } from "../../components/User/UserBadge"
import { format } from "date-fns"
import { CollaborationCreate } from "../Collaborations/CollaborationCreate"
import { UserFromAddress } from "../../components/User/UserFromAddress"
import { RadioOption } from "../../components/Input/InputRadioButtons"
import { InputRadioBtnIcon } from "../../components/Input/InputRadioBtnIcon"

const AuthoringOptions: RadioOption[] = [
  {
    value: 0,
    label: "You",
    optProps: {
      icon: <i aria-hidden className="fa-solid fa-user-cowboy" />,
    },
  },
  {
    value: 1,
    label: "Collaboration",
    optProps: {
      icon: <i aria-hidden className="fa-solid fa-people-carry-box" />,
    },
  },
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
      id: user.id,
    },
  })

  // 0: user, 1: collaboration
  const [authorType, setAuthorType] = useState<number>(
    state.collaboration == null ? 0 : 1
  )

  // the selected collaboration address
  const [selectedCollab, setSelectedCollab] = useState<string | undefined>(
    state.collaboration ? state.collaboration.id : undefined
  )

  // extract collaborations from data
  const collaborations = useMemo<Collaboration[]>(() => {
    if (!data || !data.user || !data.user.collaborationContracts) {
      return []
    } else {
      return data.user.collaborationContracts
    }
  }, [data])

  // a list of the collaborations created on-demand with the module
  const [createdCollabs, setCreatedCollabs] = useState<Collaboration[]>([])

  // build the list items from the collaboration contract
  const collaborationsListItem = useMemo<MultiListItem[]>(() => {
    return [
      ...createdCollabs.map((collab) => ({
        value: collab.id,
        props: {
          collab: collab,
          fresh: true,
        },
      })),
      ...collaborations.map((collab) => ({
        value: collab.id,
        props: {
          collab: collab,
          fresh: false,
        },
      })),
    ]
  }, [collaborations, createdCollabs])

  const handleSubmit = (evt: any) => {
    evt.preventDefault()
    let collab: Collaboration | null = null
    if (authorType === 1) {
      // build the full list of collaborations (using created ones too)
      const collabs = [...collaborations, ...createdCollabs]
      collab = collabs.find((c) => c.id === selectedCollab)!
    }
    onNext({
      collaboration: collab,
    })
  }

  const onCreateCollab = (collab: Collaboration) => {
    setCreatedCollabs([collab, ...createdCollabs])
    setSelectedCollab(collab.id)
  }

  // can we go to the next step ?
  const isValid = authorType === 0 || !!selectedCollab

  return (
    <div className={cs(style.container)}>
      <Spacing size="6x-large" sm="none" />

      <Form
        className={cs(layout.smallform, style.form, layout.w100)}
        onSubmit={handleSubmit}
      >
        <Field className={cs(layout.y_centered)}>
          <label htmlFor="authoring-type">
            Who&apos;s authoring the piece ?
          </label>
          <Spacing size="none" sm="regular" />
          <InputRadioBtnIcon
            value={authorType}
            onChange={setAuthorType}
            options={AuthoringOptions}
            className={cs(layout.grid_center, style.radios)}
          />
        </Field>

        {authorType === 1 && (
          <Field className={cs(layout.y_centered, layout.w100)}>
            <div className={cs(layout.flex_space_between)}>
              <h5>Select the collaboration</h5>
              <CollaborationCreate
                buttonSize="small"
                onCreate={onCreateCollab}
                hideOnCreate
              />
            </div>
            <Spacing size="x-small" />
            <InputMultiList<string>
              placeholder="This account isn't linked to any collaboration contract. You need to create a collaboration first."
              listItems={collaborationsListItem}
              selected={selectedCollab ? [selectedCollab] : []}
              onChangeSelected={(collab) => {
                if (collab.length > 0) {
                  setSelectedCollab(collab[0])
                } else {
                  setSelectedCollab(undefined)
                }
              }}
              multiple={false}
              className={cs(style.multilist, layout.w100)}
              btnClassName={cs(style.multilist_item)}
            >
              {({ selected, itemProps }: IMultiListItemProps) => (
                <div className={cs(style.collab)}>
                  <span className={cs(style.address)}>
                    {itemProps.collab.id}
                  </span>
                  <div className={cs(style.users)}>
                    {itemProps.collab.collaborators.map((user) =>
                      itemProps.fresh ? (
                        <UserFromAddress key={user.id} address={user.id}>
                          {({ user }) => (
                            <UserBadge
                              size="small"
                              user={user}
                              hasLink={false}
                            />
                          )}
                        </UserFromAddress>
                      ) : (
                        <UserBadge
                          key={user.id}
                          size="small"
                          user={user}
                          hasLink={false}
                        />
                      )
                    )}
                  </div>
                  <span className={cs(style.date)}>
                    <strong>Created on: </strong>
                    <span>
                      {format(
                        new Date(itemProps.collab.createdAt),
                        "MMMM d, yyyy' at 'HH:mm"
                      )}
                    </span>
                  </span>
                </div>
              )}
            </InputMultiList>
          </Field>
        )}

        <Spacing size="6x-large" sm="x-large" />

        <Button
          type="submit"
          iconComp={<i aria-hidden className="fas fa-arrow-right" />}
          iconSide="right"
          color="secondary"
          size="large"
          disabled={!isValid}
          className={style.button}
        >
          next step
        </Button>
      </Form>

      <Spacing size="3x-large" />
      <Spacing size="3x-large" sm="none" />
      <Spacing size="3x-large" sm="none" />
    </div>
  )
}
