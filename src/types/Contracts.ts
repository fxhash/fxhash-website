// a value for the state of the transaction
export enum ContractOperationStatus {
  NONE                    = "NONE",
  CALLING                 = "CALLING",
  WAITING_CONFIRMATION    = "WAITING_CONFIRMATION",
  INJECTED                = "INJECTED",
  ERROR                   = "ERROR"
}

// generic method to handle updates made on a call to a contract
export type ContractOperationCallback = (status: ContractOperationStatus, data?: string) => any

// generic signature for any contract-interraction method
export type ContractInteractionMethod<T> = (data: T, operationCallback?: ContractOperationCallback, currentTry?: number) => any

export enum FxhashContract {
  ISSUER            = "ISSUER",
  MARKETPLACE       = "MARKETPLACE",
  OBJKT             = "OBJKT",
  REGISTER          = "REGISTER",
  MODERATION        = "MODERATION",
  USER_MODERATION   = "USER_MODERATION",
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