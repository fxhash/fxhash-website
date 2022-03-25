import style from "./CollaborationCreate.module.scss"
import cs from "classnames"
import colors from "../../styles/Colors.module.css"
import layout from "../../styles/Layout.module.scss"
import { useContext, useEffect, useMemo, useState } from "react"
import { Modal } from "../../components/Utils/Modal"
import { Button } from "../../components/Button"
import { Spacing } from "../../components/Layout/Spacing"
import { InputSearchUser } from "../../components/Input/InputSearchUser"
import { Collaboration, User, UserType } from "../../types/entities/User"
import { UserContext } from "../UserProvider"
import { isTezosAddress } from "../../utils/strings"
import { ISplit } from "../../types/entities/Split"
import { InputSplits } from "../../components/Input/InputSplits"
import { useContractOperation } from "../../hooks/useContractOperation"
import { CreateCollabOperation, TCreateCollabParams } from "../../services/contract-operations/CreateCollab"
import { ContractFeedback } from "../../components/Feedback/ContractFeedback"
import { useValidate } from "../../hooks/useValidate"
import { validateCollabSplits } from "../../utils/validation/collab-splits"
import useAsyncEffect from "use-async-effect"

interface Props {
  onCreate?: (collab: Collaboration) => void
  hideOnCreate?: boolean
}
export function CollaborationCreate({
  onCreate,
  hideOnCreate = false,
}: Props) {
  const userCtx = useContext(UserContext)
  // display the modal
  const [show, setShow] = useState<boolean>(false)
  // the initial collaborators is set to current user
  const [splits, setSplits] = useState<ISplit[]>([{
    address: userCtx.user!.id,
    pct: 1000,
  }])
  // deferrer validation
  const { errors, validate } = useValidate(splits, validateCollabSplits)

  const { call, state, error, success, loading, clear, operation } = useContractOperation<TCreateCollabParams>(CreateCollabOperation)

  const createCollab = () => {
    clear()
    if (validate()) {
      call({
        splits: splits,
      })
    }
  }

  useAsyncEffect(async (isMounted) => {
    if (operation) {
      const results = await operation.operationResults()
      // get the address from the operation result
      if (results.length > 0) {
        try {
          // @ts-ignore
          const internalResults = results[0].metadata.internal_operation_results
          const address = internalResults[0].result.originated_contracts[0]
          if (address) {
            if (isMounted()) {
              if (hideOnCreate) {
                setShow(false)
              }
              if (onCreate) {
                onCreate({
                  id: address,
                  createdAt: new Date(),
                  type: UserType.COLLAB_CONTRACT_V1,
                  collaborators: splits.map(split => ({
                    id: split.address,
                  }) as User)
                } as Collaboration)
              }
            }
          }
        }
        catch {}
      }
    }
  }, [operation])

  return (
    <>
      <Button
        size="regular"
        iconComp={<i aria-hidden className="fa-solid fa-plus"/>}
        onClick={() => setShow(true)}
      >
        create new collaboration
      </Button>

      {show && (
        <Modal
          title="Create a collaboration contract"
          onClose={() => setShow(false)}
        >
          <em className={cs(style.desc)}>
            This module lets you originate a new collaboration contract with other artists. A collaboration contract can be used to sign operations related to the creation/update of Generative Tokens as a group. Each collaborator will have to give their approval before an operation can be sent.
          </em>

          <Spacing size="regular"/>

          <h6>Collaborators</h6>
          <Spacing size="8px"/>
          <em className={cs(style.desc)}>
            Shares are used when withdrawing funds from the contract if somehow some tezos were sent to it (external marketplaces for instance).
            <br/>
            <strong>It's an uncommon operation and we recommend leaving the default values</strong>.
          </em>
          <Spacing size="small"/>
          <div className={cs(layout.y_centered)}>
            <InputSplits
              value={splits}
              onChange={setSplits}
              unremoveableAddresses={[userCtx.user!.id]}
            />
          </div>

          <Spacing size="x-large"/>

          <div className={cs(layout.y_centered)}>
            {errors && errors.length > 0 && (
              <>
                <strong className={cs(colors.error)}>
                  {errors[0]}
                </strong>
                <Spacing size="x-small"/>
              </>
            )}
            <ContractFeedback
              state={state}
              success={success}
              error={error}
              loading={loading}
              successMessage="Your collaboration contract was created"
            />
            <Button
              color="secondary"
              style={{ margin: "auto" }}
              onClick={createCollab}
              state={loading ? "loading" : "default"}
            >
              create collaboration
            </Button>
          </div>
        </Modal>
      )}
    </>
  )
}