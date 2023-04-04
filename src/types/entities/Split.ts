import { User } from "./User"

export interface ISplit {
  address: string
  pct: number
}

export interface Split {
  pct: number
  user: User
}
