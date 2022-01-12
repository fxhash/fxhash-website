import style from "./BurnToken.module.scss"
import colors from "../../styles/Colors.module.css"
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
    
  return (
    <div className={cs(style.container, {
      [style.disabled]: !canTokenBeBurned(token)
    })}>
      <h3 className={cs(colors.primary)}>Burn token</h3>

      {canTokenBeBurned(token) ? (
        <p>
          <strong>This action is irreversible. Token will be deleted from the contract and the indexer. You will be able to mint another token right away.</strong>
        </p>
      ):(
        <p>This action is not available anymore because token was minted {token.supply-token.balance} times</p>
      )}

      <ContractFeedback
        state={state}
        success={success}
        error={error}
        loading={loading}
      />

      <Button
        color="primary"
        size="medium"
        onClick={() => call(token.id)}
        state={loading ? "loading" : "default"}
        disabled={!canTokenBeBurned(token)}
      >
        burn token
      </Button>
    </div>
  )
}