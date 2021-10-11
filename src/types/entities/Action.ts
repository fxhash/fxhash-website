import { HistoryMetadata } from '../Metadata'
import { GenerativeToken } from './GenerativeToken'
import { Objkt } from './Objkt'
import { User } from './User'


export enum TokenActionType {
  NONE              = "NONE",
  UPDATE_STATE      = "UPDATE_STATE",
  MINTED            = "MINTED",
  MINTED_FROM       = "MINTED_FROM",
  COMPLETED         = "COMPLETED",
  TRANSFERED        = "TRANSFERED",
  OFFER             = "OFFER",
  OFFER_CANCELLED   = "OFFER_CANCELLED",
  OFFER_ACCEPTED    = "OFFER_ACCEPTED"
}

export interface Action {
  id: string
  type: TokenActionType
  issuer?: User
  target?: User
  token?: GenerativeToken
  objkt?: Objkt
  metadata: HistoryMetadata
  createdAt: Date
}