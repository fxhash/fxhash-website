import style from "./ContractFeedback.module.scss"
import cs from "classnames"
import { ContractOperationStatus } from "../../types/Contracts"
import { Spacing } from "../Layout/Spacing"


interface Props {
  state: ContractOperationStatus
  success: boolean
  error: boolean
  loading: boolean
  successMessage?: string
  errorMessage?: string
}

function messageFromState(state: ContractOperationStatus): string {
  switch (state) {
    case ContractOperationStatus.CALLING:
      return "Contract call initiated"
    case ContractOperationStatus.WAITING_CONFIRMATION:
      return "Waiting for blockchain confirmation. This can sometimes take up to a minute."
    default:
      return "Preparing contract call"
  }
}

export function ContractFeedback({
  state,
  success,
  error,
  loading,
  successMessage = "The operation was successfully injected into the blockchain",
  errorMessage = "There was an error when injecting into the blockchain"
}: Props) {
  return (
    <>
      {(loading || success || error) && (
        <div className={cs(style.container)}>
          {error ? (
            <span className={cs(style.error)}>{ errorMessage }</span>
          ):(
            success ? (
              <span className={cs(style.success)}>{ successMessage }</span>
            ):(
              loading && (
                <span className={cs(style.loading)}>{ messageFromState(state) }</span>
              )
            )
          )}
          <Spacing size="x-small"/>
        </div>
      )}
    </>
  )
}