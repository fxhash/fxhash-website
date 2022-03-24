import type { WalletOperation } from "@taquito/taquito"

// a value for the state of the transaction
export enum ContractOperationStatus {
  NONE                    = "NONE",
  CALLING                 = "CALLING",
  WAITING_CONFIRMATION    = "WAITING_CONFIRMATION",
  INJECTED                = "INJECTED",
  ERROR                   = "ERROR"
}

// generic method to handle updates made on a call to a contract
export type ContractOperationCallback = (status: ContractOperationStatus, data?: any) => any

// generic signature for any contract-interraction method
export type ContractInteractionMethod<T> = (data: T, operationCallback?: ContractOperationCallback, currentTry?: number) => any

export enum FxhashContract {
  ISSUER            = "ISSUER",
  MARKETPLACE_V1    = "MARKETPLACE_V1",
  MARKETPLACE_V2    = "MARKETPLACE_V2",
  GENTK_V1          = "GENTK_V1",
  GENTK_V2          = "GENTK_V2",
  REGISTER          = "REGISTER",
  MODERATION        = "MODERATION",
  USER_MODERATION   = "USER_MODERATION",
  COLLAB_FACTORY    = "COLLAB_FACTORY",
}

export type ContractCallHookReturn<T> = {
  state: ContractOperationStatus,
  loading: boolean,
  success: boolean,
  error: boolean,
  transactionHash: string|null,
  call: (data: T) => void,
  clear: () => void
}

export type TContractOperationHookReturn<Params> = {
  state: ContractOperationStatus,
  loading: boolean,
  success: boolean,
  error: boolean,
  opHash: string|null,
  operation: WalletOperation|null
  call: (data: Params) => void,
  clear: () => void
}