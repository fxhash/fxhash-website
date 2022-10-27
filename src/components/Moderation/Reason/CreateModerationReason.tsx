import style from "./CreateModerationReason.module.scss"
import cs from "classnames"
import { Form } from "../../Form/Form"
import { Field } from "../../Form/Field"
import { InputText } from "../../Input/InputText"
import { useState } from "react"
import { Button } from "../../Button"
import { Submit } from "../../Form/Submit"
import { useContractOperation } from "../../../hooks/useContractOperation"
import { ResonAddOperation } from "../../../services/contract-operations/ReasonAdd"
import { ContractFeedback } from "../../Feedback/ContractFeedback"

interface Props {
  moderationContract: "token" | "user" | "article"
}
export function CreateModerationReason({ moderationContract }: Props) {
  const [reason, setReason] = useState<string>("")

  const { state, success, loading, error, call } =
    useContractOperation(ResonAddOperation)

  return (
    <Form>
      <Field>
        <label>
          Reason
          <small>As concise as possible (will be stored on chain)</small>
        </label>
        <InputText
          value={reason}
          onChange={(evt) => setReason(evt.target.value)}
          placeholder="Copymint, Hateful, Market manipulation,..."
        />
      </Field>

      <Submit>
        <ContractFeedback
          state={state}
          success={success}
          loading={loading}
          error={error}
        />
        <Button
          type="button"
          color="secondary"
          size="regular"
          disabled={reason.length === 0}
          state={loading ? "loading" : "default"}
          onClick={() => {
            call({
              contract: moderationContract,
              reason: reason,
            })
          }}
        >
          create reason
        </Button>
      </Submit>
    </Form>
  )
}
