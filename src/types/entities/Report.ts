import { GenerativeToken } from "./GenerativeToken"
import { User } from "./User"

export interface Report {
  id: string
  user?: User
  token?: GenerativeToken
  createdAt: Date
}
