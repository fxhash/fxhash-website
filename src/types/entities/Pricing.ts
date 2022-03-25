export interface IPricingFixed {
  price: number
  opensAt?: Date|null
}

export interface IPricingDutchAuction {
  levels: number[]
  restingPrice?: number
  decrementDuration: number
  opensAt?: Date|null
}