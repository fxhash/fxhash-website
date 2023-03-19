// import style from "./ModeratorActions.module.scss"
import layout from "../../styles/Layout.module.scss"
import cs from "classnames"
import { useContext } from "react"
import {
  GenerativeToken,
  GenerativeTokenVersion,
} from "../../types/entities/GenerativeToken"
import { User } from "../../types/entities/User"
import { UserContext } from "../UserProvider"
import { Button } from "../../components/Button"
import { Spacing } from "../../components/Layout/Spacing"
import { ContractFeedback } from "../../components/Feedback/ContractFeedback"
import { isTokenModerator } from "../../utils/user"
import { useContractOperation } from "hooks/useContractOperation"
import { ModerateOperation } from "services/contract-operations/Moderate"

interface Props {
  token: GenerativeToken
}
export function ModeratorActions({ token }: Props) {
  const userCtx = useContext(UserContext)
  const user = userCtx.user

  const {
    state: callState,
    loading: contractLoading,
    success,
    call,
    error: contractError,
  } = useContractOperation(ModerateOperation)

  const moderate = (state: 1 | 4) => {
    call({
      entityId: token.id,
      state: state,
      contract:
        token.version === GenerativeTokenVersion.PRE_V3 ? "token" : "token_v3",
      reason: -1,
    })
  }

  return user && isTokenModerator(user as User) ? (
    <>
      <Spacing size="x-small" />

      <ContractFeedback
        state={callState}
        loading={contractLoading}
        success={success}
        error={contractError}
        successMessage="Token was moderated !"
      />

      <div className={cs(layout["x-inline"])}>
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
  ) : null
}
