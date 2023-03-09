import style from "./BurnToken.module.scss"
import colors from "styles/Colors.module.css"
import cs from "classnames"
import { GenerativeToken } from "types/entities/GenerativeToken"
import { canTokenBeBurned } from "utils/tokens"
import { Button } from "components/Button"
import { ContractFeedback } from "components/Feedback/ContractFeedback"
import { useContractOperation } from "hooks/useContractOperation"
import { TContractOperation } from "services/contract-operations/ContractOperation"

interface Props {
  token: GenerativeToken
  contractOperation: TContractOperation<any>
}

export function BurnToken({ token, contractOperation }: Props) {
  const { call, loading, error, success, state } =
    useContractOperation(contractOperation)

  return (
    <div
      className={cs(style.container, {
        [style.disabled]: !canTokenBeBurned(token),
      })}
    >
      <h3 className={cs(colors.primary)}>Burn token</h3>

      {canTokenBeBurned(token) ? (
        <p>
          <strong>
            This action is irreversible. Token will be deleted from the contract
            and the indexer. You will be able to mint another token right away.
          </strong>
        </p>
      ) : (
        <p>
          This action is not available anymore because token was minted{" "}
          {token.supply - token.balance} times
        </p>
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
        onClick={() =>
          call({
            token: token,
          })
        }
        state={loading ? "loading" : "default"}
        disabled={!canTokenBeBurned(token)}
      >
        burn token
      </Button>
    </div>
  )
}
