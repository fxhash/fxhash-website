import { addDays } from "date-fns"
import { MintTicket } from "../../types/entities/MintTicket"
import { getMintTicketHarbergerTax } from "../../utils/math"

export const getTicketLastDayConsumed = (createdAt: Date) => {
  const dateCreatedAt = new Date(createdAt)
  const now = new Date()
  const daysSinceCreated = Math.trunc(
    (now.getTime() - dateCreatedAt.getTime()) / 86400000
  )
  return addDays(dateCreatedAt, daysSinceCreated)
}

export const getUpdatedPriceAmountToPayOrClaim = (
  mintTicket: MintTicket,
  newTzPrice: number,
  newCoverage: number
) => {
  const now = new Date()
  const taxStart = new Date(mintTicket.taxationStart)
  const daysSinceLastTaxation =
    now < taxStart
      ? 0
      : Math.trunc((now.getTime() - taxStart.getTime()) / 86400000)
  const taxToPay = getMintTicketHarbergerTax(
    mintTicket.price,
    daysSinceLastTaxation
  )
  const taxLeft = parseInt(mintTicket.taxationLocked) - taxToPay
  const taxRequiredForCoverage = getMintTicketHarbergerTax(
    newTzPrice,
    newCoverage
  )
  const totalToPayOrClaim = taxRequiredForCoverage - taxLeft
  return totalToPayOrClaim
}
