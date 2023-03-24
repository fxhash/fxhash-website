import { GenerativeToken } from "./GenerativeToken"
import { User } from "./User"
import { MediaImage } from "./MediaImage"

export interface MintTicket {
  id: number
  token: GenerativeToken
  owner: User
  createdAt: Date
  price: number
  taxationLocked: string
  taxationStart: Date
  taxationPaidUntil: Date
  settings: MintTicketSettings
}

export interface MintTicketSettings {
  token: GenerativeToken
  gracingPeriod: number
  metadata: MintTicketMetadata
  metadataUri?: string
  captureMedia?: MediaImage
}

export interface MintTicketMetadata {}
