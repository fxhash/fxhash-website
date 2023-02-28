export type TInputUpdateOperators = {
  add_operator?: {
    owner: string
    operator: string
    token_id: number
  }
  remove_operator?: {
    owner: string
    operator: string
    token_id: number
  }
}[]
