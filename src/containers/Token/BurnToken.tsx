import style from "./BurnToken.module.scss"
import cs from "classnames"
import { GenerativeToken } from "../../types/entities/GenerativeToken"
import { canTokenBeBurned } from "../../utils/tokens"
import { Button } from "../../components/Button"
import { useContext, useEffect } from "react"
import { UserContext } from "../UserProvider"
import { useContractCall } from "../../utils/hookts"
import { ContractFeedback } from "../../components/Feedback/ContractFeedback"
import { useRouter } from "next/router"
import { getUserProfileLink } from "../../utils/user"


interface Props {
  token: GenerativeToken
}

export function BurnToken({ token }: Props) {
  const userCtx = useContext(UserContext)
  const router = useRouter()

  const { state, loading, success, call, error } = 
    useContractCall<number>(userCtx.walletManager!.burnGenerativeToken)

  useEffect(() => {
    if (success && userCtx && userCtx.user) {
      router.replace(getUserProfileLink(userCtx.user))
    }
  }, [success])
    
  return canTokenBeBurned(token) ? (
    <>
      <ContractFeedback
        state={state}
        success={success}
        error={error}
        loading={loading}
      />

      <Button
        color="primary"
        size="small"
        onClick={() => call(token.id)}
        state={loading ? "loading" : "default"}
      >
        burn token (only available if 0 minted)
      </Button>
    </>
  ):null
}