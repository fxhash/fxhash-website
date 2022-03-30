export interface IPricingFixed<GNumber = number, GDate = Date> {
  price: GNumber
  opensAt?: GDate|null
}

export interface IPricingDutchAuction<N = number> {
  levels: N[]
  restingPrice?: number
  finalPrice?: number
  decrementDuration: N
  opensAt?: Date|null
}