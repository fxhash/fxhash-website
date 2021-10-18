// a value for the state of the transaction
export enum ContractOperationStatus {
  NONE                    = "NONE",
  CALLING                 = "CALLING",
  WAITING_CONFIRMATION    = "WAITING_CONFIRMATION",
  INJECTED                = "INJECTED",
  ERROR                   = "ERROR"
}

// generic method to handle updates made on a call to a contract
export type ContractOperationCallback = (status: ContractOperationStatus) => any

// generic signature for any contract-interraction method
export type ContractInteractionMethod<T> = (data: T, operationCallback?: ContractOperationCallback) => any

export enum FxhashContract {
  ISSUER        = "ISSUER",
  MARKETPLACE   = "MARKETPLACE",
  OBJKT         = "OBJKT",
  REGISTER      = "REGISTER"
}

export type ContractCallHookReturn<T> = {
  state: ContractOperationStatus,
  loading: boolean,
  success: boolean,
  error: boolean,
  call: (data: T) => void,
  clear: () => void
}