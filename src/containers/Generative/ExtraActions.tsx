import style from "./ExtraActions.module.scss"
import cs from "classnames"
import colors from "../../styles/Colors.module.css"
import { Dropdown } from "../../components/Navigation/Dropdown"
import { useContext, useState } from "react"
import { Modal } from "../../components/Utils/Modal"
import { Button } from "../../components/Button"
import { UserContext } from "../UserProvider"
import { useContractCall } from "../../utils/hookts"
import { ModerateCall, ReportCall } from "../../types/ContractCalls"
import { GenerativeToken, GenTokFlag } from "../../types/entities/GenerativeToken"
import { ContractFeedback } from "../../components/Feedback/ContractFeedback"
import { Select } from "../../components/Input/Select"
import { Form } from "../../components/Form/Form"
import { UserRole } from "../../types/entities/User"
import { Field } from "../../components/Form/Field"
import { Spacing } from "../../components/Layout/Spacing"


function OpenButton() {
  return (
    <i aria-hidden className="fas fa-ellipsis-v"/>
  )
}

interface Props {
  token: GenerativeToken
}
export function GenerativeExtraActions({
  token,
}: Props) {
  const userCtx = useContext(UserContext)
  const user = userCtx.user!
  
  const [reportModal, setReportModal] = useState<boolean>(false)
  const [moderateModal, setModerateModal] = useState<boolean>(false)
  const [moderateVal, setModerateVal] = useState<number>(0)

  const { state: callState, loading: contractLoading, success, call, error: contractError } = 
    useContractCall<ReportCall>(userCtx.walletManager!.report)

  const { state: callStateMod, loading: contractLoadingMod, success: successMod, call: callMod, error: contractErrorMod } = 
    useContractCall<ModerateCall>(userCtx.walletManager!.moderateToken)

  const report = () => {
    call({
      tokenId: token.id
    })
  }

  const moderate = (evt: any) => {
    evt.preventDefault()
    callMod({
      tokenId: token.id,
      state: moderateVal
    })
  }

  return (
    <>
      {reportModal && (
        <Modal
          title="Do you want to report this Generative Token ?"
          onClose={() => setReportModal(false)}
        >
          <em className={cs(colors.gray)}>Thank you for taking the time to make the platform a safer place for the community !</em>
          <p>
            If 10 users report this Generative Token over a 1 hour period, then it will be removed from the front-end until a trusted member moderates the Token and assert if whether or not it violates the code of conduct of the platform.
          </p>

          <div className={cs(style.reports_bottom)}>
            <ContractFeedback
              state={callState}
              loading={contractLoading}
              success={success}
              error={contractError}
              successMessage="Token was reported !"
            />

            <div className={cs(style.report_btns)}>
              {!contractLoading && (
                <Button
                  color="transparent"
                  size="small"
                  onClick={() => setReportModal(false)}
                >
                  cancel report
                </Button>
              )}
              <Button
                color="primary"
                size="small"
                onClick={report}
                state={contractLoading ? "loading" : "default"}
              >
                report the token
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {moderateModal && (
        <Modal
          title="Manual moderation of a Token"
          onClose={() => setModerateModal(false)}
        >
          <p>
            With this utility you can force the moderation of a Generative Token. This action can be reversed at any point in time. In case of a doubt, setting the flag "REPORTED" will put the Token in the "Awaiting Moderation" list for further deliberation.
          </p>

          <div className={cs(style.reports_bottom)}>
            <ContractFeedback
              state={callStateMod}
              loading={contractLoadingMod}
              success={successMod}
              error={contractErrorMod}
              successMessage="Token was moderated !"
            />

            <div className={cs(style.report_btns)}>
              <Form onSubmit={moderate}>
                <Field>
                  <Select
                    value={moderateVal}
                    onChange={setModerateVal}
                    options={Object.keys(GenTokFlag).map((flag, idx) => ({
                      label: flag,
                      value: idx
                    }))}
                  />
                </Field>
                <Spacing size="x-small"/>
                <Button
                  color="primary"
                  size="regular"
                  state={contractLoadingMod ? "loading" : "default"}
                >
                  moderate the token
                </Button>
              </Form>
            </div>
          </div>
        </Modal>
      )}

      <div className={cs(style.container)}>
        <Dropdown
          itemComp={<OpenButton />}
          className={style.btns_container}
          btnClassName={style.open_btn}
        >
          <button
            className={cs(style.btn_action)}
            onClick={() => setReportModal(true)}
          >
            <i aria-hidden className="fas fa-exclamation-triangle"/>
            <span>report token</span>
          </button>

          {user && user.role === UserRole.MODERATOR && (
            <button
              className={cs(style.btn_action)}
              onClick={() => setModerateModal(true)}
            >
              <i aria-hidden className="fas fa-gavel"/>
              <span>moderate token</span>
            </button>
          )}
        </Dropdown>
      </div>
    </>
  )
}