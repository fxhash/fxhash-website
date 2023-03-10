import { TzktOperation } from "./Tzkt"
import type { WalletOperation } from "@taquito/taquito"

// a value for the state of the transaction
export enum ContractOperationStatus {
  NONE = "NONE",
  CALLING = "CALLING",
  WAITING_CONFIRMATION = "WAITING_CONFIRMATION",
  INJECTED = "INJECTED",
  ERROR = "ERROR",
}

// generic method to handle updates made on a call to a contract
export type ContractOperationCallback = (
  status: ContractOperationStatus,
  data?: any
) => any

// generic signature for any contract-interraction method
export type ContractInteractionMethod<T> = (
  data: T,
  operationCallback?: ContractOperationCallback,
  currentTry?: number
) => any

export const FxhashContracts = {
  ISSUER: process.env.NEXT_PUBLIC_TZ_CT_ADDRESS_ISSUER!,
  ISSUER_V3: process.env.NEXT_PUBLIC_TZ_CT_ADDRESS_ISSUER_V3!,
  MINT_TICKETS_V3: process.env.NEXT_PUBLIC_TZ_CT_ADDRESS_MINT_TICKETS_V3!,
  MARKETPLACE_V1: process.env.NEXT_PUBLIC_TZ_CT_ADDRESS_MARKETPLACE_V1!,
  MARKETPLACE_V2: process.env.NEXT_PUBLIC_TZ_CT_ADDRESS_MARKETPLACE_V2!,
  MARKETPLACE_V3: process.env.NEXT_PUBLIC_TZ_CT_ADDRESS_MARKETPLACE_V3!,
  GENTK_V1: process.env.NEXT_PUBLIC_TZ_CT_ADDRESS_GENTK_V1!,
  GENTK_V2: process.env.NEXT_PUBLIC_TZ_CT_ADDRESS_GENTK_V2!,
  GENTK_V3: process.env.NEXT_PUBLIC_TZ_CT_ADDRESS_GENTK_V3!,
  ARTICLES: process.env.NEXT_PUBLIC_TZ_CT_ADDRESS_ARTICLES!,
  REGISTER: process.env.NEXT_PUBLIC_TZ_CT_ADDRESS_USERREGISTER!,
  MODERATION: process.env.NEXT_PUBLIC_TZ_CT_ADDRESS_TOK_MODERATION!,
  MODERATION_V3: process.env.NEXT_PUBLIC_TZ_CT_ADDRESS_TOK_MODERATION_V3!,
  USER_MODERATION: process.env.NEXT_PUBLIC_TZ_CT_ADDRESS_USER_MODERATION!,
  ARTICLE_MODERATION: process.env.NEXT_PUBLIC_TZ_CT_ADDRESS_ARTICLE_MODERATION!,
  COLLAB_FACTORY: process.env.NEXT_PUBLIC_TZ_CT_ADDRESS_COLLAB_FACTORY!,
}

export const FxhashCollabFactoryCalls = {
  // PRE_V3 contracts
  MINT_ISSUER: 0,
  UPDATE_ISSUER: 1,
  UPDATE_PRICE: 2,
  UPDATE_RESERVE: 3,
  BURN_SUPPLY: 4,
  BURN: 5,
  // V3 contracts
  MINT_ISSUER_V3: 6,
  UPDATE_ISSUER_V3: 7,
  UPDATE_PRICE_V3: 8,
  UPDATE_RESERVE_V3: 9,
  BURN_SUPPLY_V3: 10,
  BURN_V3: 11,
}

export type ContractCallHookReturn<T> = {
  state: ContractOperationStatus
  loading: boolean
  success: boolean
  error: boolean
  transactionHash: string | null
  call: (data: T) => void
  clear: () => void
}

export type TContractOperationHookReturn<Params> = {
  state: ContractOperationStatus
  loading: boolean
  success: boolean
  error: boolean
  opHash: string | null
  operation: WalletOperation | null
  opData: TzktOperation[] | null
  params: Params | null
  call: (data: Params) => void
  clear: () => void
}
