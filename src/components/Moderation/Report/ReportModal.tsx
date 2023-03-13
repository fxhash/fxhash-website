import { useMemo, useState } from "react"
import cs from "classnames"
import style from "./ReportModal.module.scss"
import text from "styles/Text.module.css"
import { InputModerationReason } from "components/Input/InputModerationReason"
import { Infobox } from "components/Layout/Infobox"
import { Modal } from "components/Utils/Modal"
import {
  GenerativeToken,
  GenerativeTokenVersion,
} from "types/entities/GenerativeToken"
import { ContractFeedback } from "components/Feedback/ContractFeedback"
import { Button } from "components/Button"
import { useContractOperation } from "hooks/useContractOperation"
import { ReportTokenOperation } from "services/contract-operations/ReportToken"
import { Field } from "components/Form/Field"
import { Spacing } from "components/Layout/Spacing"

interface Props {
  token: GenerativeToken
  onClose: () => void
}
export function ReportModal({ token, onClose }: Props) {
  // the moderation reason
  const [reason, setReason] = useState<number>(-1)

  const { state, loading, success, call, error } =
    useContractOperation(ReportTokenOperation)

  const contract = useMemo<"token" | "token_v3">(
    () =>
      token.version === GenerativeTokenVersion.PRE_V3 ? "token" : "token_v3",
    [token]
  )

  const report = () => {
    call({
      tokenId: token.id,
      reason: reason,
      contract: contract,
    })
  }

  return (
    <Modal
      title="Do you want to report this Generative Token ?"
      onClose={onClose}
    >
      <Infobox
        icon={<i className="fa-sharp fa-solid fa-face-smile" aria-hidden />}
      >
        Thank you for taking the time to make the platform a safer place for the
        community !
      </Infobox>

      <p className={cs(text.info)}>
        If 10 users report this Generative Token over a 1 hour period, then it
        will be removed from the front-end until a trusted member moderates the
        Token and assert if whether or not it violates the code of conduct of
        the platform.
      </p>

      <Field>
        <label>Reason</label>
        <InputModerationReason
          value={reason}
          onChange={setReason}
          moderationContract={contract}
        />
      </Field>

      <Spacing size="x-large" />

      <div className={cs(style.reports_bottom)}>
        <ContractFeedback
          state={state}
          loading={loading}
          success={success}
          error={error}
          successMessage="Token was reported !"
        />

        <div className={cs(style.report_btns)}>
          {!loading && (
            <Button color="transparent" size="small" onClick={onClose}>
              cancel report
            </Button>
          )}
          <Button
            color="primary"
            size="small"
            onClick={report}
            state={loading ? "loading" : "default"}
          >
            report the token
          </Button>
        </div>
      </div>
    </Modal>
  )
}
