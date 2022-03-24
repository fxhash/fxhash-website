export interface IPricingFixed {
  price: number
  opensAt: Date
}

export interface IPricingDutchAuction {
  levels: number[]
  restingPrice?: number
  decrementDuration: number
  opensAt?: Date
}