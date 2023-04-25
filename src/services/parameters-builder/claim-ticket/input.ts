export type TClaimTicket = {
  token_id: number
  transfer_to: string | null
  taxation: {
    price: number
    coverage: number
  }
}
