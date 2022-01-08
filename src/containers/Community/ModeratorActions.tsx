// import style from "./ModeratorActions.module.scss"
import layout from "../../styles/Layout.module.scss"
import cs from "classnames"
import { useContext } from "react"
import { GenerativeToken } from "../../types/entities/GenerativeToken"
import { UserRole } from "../../types/entities/User"
import { UserContext } from "../UserProvider"
import { Button } from "../../components/Button"
import { Spacing } from "../../components/Layout/Spacing"
import { useContractCall } from "../../utils/hookts"
import { ModerateCall } from "../../types/ContractCalls"
import { ContractFeedback } from "../../components/Feedback/ContractFeedback"

interface Props {
  token: GenerativeToken
}
export function ModeratorActions({
  token,
}: Props) {
  const userCtx = useContext(UserContext)
  const user = userCtx.user

  const { state: callState, loading: contractLoading, success, call, error: contractError } = 
    useContractCall<ModerateCall>(userCtx.walletManager!.moderateToken)

  const moderate = (state: 1|4) => {
    call({
      tokenId: token.id,
      state: state
    })
  }
  
  return user && user.role === UserRole.MODERATOR ? (
    <>
      <Spacing size="x-small"/>

      <ContractFeedback
        state={callState}
        loading={contractLoading}
        success={success}
        error={contractError}
        successMessage="Token was moderated !"
      />

      <div className={cs(layout['x-inline'])}>
        <Button
          color="primary"
          size="small"
          onClick={() => moderate(4)}
          state={contractLoading ? "loading" : "default"}
        >
          reject token
        </Button>
        <Button
          color="secondary"
          size="small"
          onClick={() => moderate(1)}
          state={contractLoading ? "loading" : "default"}
        >
          approve token
        </Button>
      </div>
    </>
  ):null
}