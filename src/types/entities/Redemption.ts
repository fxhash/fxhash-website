import { Objkt } from "./Objkt"
import { Redeemable } from "./Redeemable"
import { User } from "./User"

export interface Redemption {
  id: number
  redeemable: Redeemable
  objkt: Objkt
  redeemer: User
  createdAt: string
}
