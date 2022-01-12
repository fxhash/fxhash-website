import cs from "classnames"
import style from "./UserModeration.module.scss"
import layout from "../../styles/Layout.module.scss"
import { Button } from "../../components/Button"
import { User } from "../../types/entities/User"
import { isModerator } from "../../utils/user"
import { useContext, useState } from "react"
import { UserContext } from "../UserProvider"
import { useContractCall } from "../../utils/hookts"
import { ContractFeedback } from "../../components/Feedback/ContractFeedback"
import { UserModerationModal } from "./UserModerationModal"

interface Props {
  user: User
}
export function UserModeration({
  user,
}: Props) {
  const userCtx = useContext(UserContext)
  const userConnected = userCtx.user!
  
  const [moderateModal, setModerateModal] = useState<boolean>(false)

  const { state: verifyCallState, loading: verifyLoading, success: verifySuccess, call: callVerify, error: verifyError } = 
    useContractCall<string>(userCtx.walletManager!.verifyUser)

  const { state: banCallState, loading: banLoading, success: banSuccess, call: callBan, error: banError } = 
    useContractCall<string>(userCtx.walletManager!.banUser)

  return (
    isModerator(userConnected as User) ? (
      <>
        {moderateModal && (
          <UserModerationModal
            user={user}
            onClose={() => setModerateModal(false)}
          />
        )}
        <div>
          <div className={cs(layout.buttons_inline)}>
            <Button
              type="button"
              size="small"
              color="secondary"
              state={verifyLoading ? "loading" : "default"}
              onClick={() => callVerify(user.id)}
            >
              verify
            </Button>
            <Button
              type="button"
              size="small"
              color="black"
              onClick={() => setModerateModal(true)}
            >
              moderate
            </Button>
            <Button
              type="button"
              size="small"
              color="primary"
              state={banLoading ? "loading" : "default"}
              onClick={() => callBan(user.id)}
            >
              ban
            </Button>
          </div>

          <ContractFeedback
            state={verifyCallState}
            loading={verifyLoading}
            success={verifySuccess}
            error={verifyError}
            successMessage="User is now verified"
            className={cs(style.contract_feedback)}
          />

          <ContractFeedback
            state={banCallState}
            loading={banLoading}
            success={banSuccess}
            error={banError}
            successMessage="User is now banned"
            className={cs(style.contract_feedback)}
          />
        </div>
      </>
    ):null
  )
}