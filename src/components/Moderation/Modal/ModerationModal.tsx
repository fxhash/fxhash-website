import style from "./ModerationModal.module.scss"
import text from "../../../styles/Text.module.css"
import cs from "classnames"
import { Modal, Props as ModalProps } from "../../Utils/Modal"
import { Form } from "../../Form/Form"
import { Field } from "../../Form/Field"
import { IOptions, Select } from "../../Input/Select"
import { useState } from "react"
import { ContractFeedback } from "../../Feedback/ContractFeedback"
import { InputModerationReason } from "../../Input/InputModerationReason"
import { Spacing } from "../../Layout/Spacing"
import { Button } from "../../Button"
import { useContractOperation } from "../../../hooks/useContractOperation"
import { ModerateOperation } from "../../../services/contract-operations/Moderate"
import Link from "next/link"
import { Submit } from "../../Form/Submit"

interface Props extends ModalProps {
  moderationContract: "token"|"user"|"article"
  infoText: string
  infoState?: string
  flags: IOptions[]
  entityId: any
}
export function ModerationModal({
  entityId,
  title,
  infoText,
  infoState,
  flags,
  onClose,
  index,
  className,
  moderationContract,
}: Props) {

  // the moderation state
  const [moderationState, setModerationState] = useState<number>(0)
  // the moderation reason
  const [reason, setReason] = useState<number>(-1)

  const { 
    state, loading, success, call, error 
  } = useContractOperation(ModerateOperation)

  const moderate = (evt: any) => {
    evt.preventDefault()
    call({
      entityId: entityId,
      state: moderationState,
      reason: reason,
      contract: moderationContract,
    })
  }

  return (
    <Modal
      title={title}
      onClose={onClose}
      index={index}
      className={className}
    >
      <span className={cs(text.info)}>
        {infoText}
      </span>

      <Spacing size="large"/>

      <div className={cs(style.reports_bottom)}>
        <div className={cs(style.report_btns)}>
          <Form onSubmit={moderate}>
            <Field>
              <label>
                State
                {infoState && (
                  <small>
                    {infoState}
                  </small>
                )}
              </label>
              <Select
                value={moderationState}
                onChange={setModerationState}
                options={flags}
              />
            </Field>

            <Field>
              <label>
                Reason
                <small>
                  If no reason fits this case, you can{" "}
                  <Link href={`/moderation/${moderationContract}/create-reason`}>
                    <a target="_blank">create a new reason here</a>
                  </Link>
                  . You will have to refresh this page until the indexer has picked the new reason.
                </small>
              </label>
              <InputModerationReason
                value={reason}
                onChange={setReason}
                moderationContract={moderationContract}
              />
            </Field>

            <Submit>
              <ContractFeedback
                state={state}
                loading={loading}
                success={success}
                error={error}
              />
              <Button
                color="primary"
                size="small"
                state={loading ? "loading" : "default"}
              >
                moderate the {moderationContract}
              </Button>
            </Submit>
          </Form>
        </div>
      </div>
    </Modal>
  )
}