import { MintTicket, MintTicketSettings } from "../../types/entities/MintTicket"
import { getUpdatedPriceAmountToPayOrClaim } from "./updatePrice"
import { addDays } from "date-fns"

describe("ticket_updatePrice", () => {
  const ticket = {
    id: 1,
    createdAt: new Date("2023-01-01T10:00:00.175Z"),
    price: 10000000,
    taxationLocked: "0",
    taxationStart: new Date("2023-01-03T10:00:00.175Z"),
    settings: {
      gracingPeriod: 2,
    } as MintTicketSettings,
  } as MintTicket
  it("should extend coverage before the end of grace period", () => {
    jest.useFakeTimers().setSystemTime(new Date("2023-01-01T10:00:00.175Z"))
    const newPrice = 20000000
    const coverage = 7
    const amount = getUpdatedPriceAmountToPayOrClaim(ticket, newPrice, coverage)
    expect(amount).toEqual(196000)
    ticket.taxationLocked = amount.toString()
    ticket.price = newPrice
  })
  it("should reduce price before the end of grace period", () => {
    const newPrice = 10000000
    const coverage = 7
    const amount = getUpdatedPriceAmountToPayOrClaim(ticket, newPrice, coverage)
    expect(amount).toEqual(-98000)
    // 98000
    ticket.price = newPrice
    ticket.taxationLocked = (
      parseInt(ticket.taxationLocked) + amount
    ).toString()
  })
  it("should reduce coverage before the end of grace period", () => {
    const newPrice = 10000000
    const coverage = 3
    const amount = getUpdatedPriceAmountToPayOrClaim(ticket, newPrice, coverage)
    expect(amount).toEqual(-56000)
    // 42000
    ticket.taxationLocked = (
      parseInt(ticket.taxationLocked) + amount
    ).toString()
    ticket.price = newPrice
  })
  it("should rise price before the end of grace period", () => {
    const newPrice = 40000000
    const coverage = 3
    const amount = getUpdatedPriceAmountToPayOrClaim(ticket, newPrice, coverage)
    expect(amount).toEqual(126000)
    // 168000
    ticket.taxationLocked = (
      parseInt(ticket.taxationLocked) + amount
    ).toString()
    ticket.price = newPrice
  })
  it("should keep the same coverage after the end of grace period", () => {
    jest.useFakeTimers().setSystemTime(new Date("2023-01-05T10:00:01.175Z"))
    const newPrice = 40000000
    const coverage = 1
    const amount = getUpdatedPriceAmountToPayOrClaim(ticket, newPrice, coverage)
    expect(amount).toEqual(0)
  })
  it("should change coverage 1 days after the end of grace period", () => {
    jest.useFakeTimers().setSystemTime(new Date("2023-01-04T10:00:01.175Z"))
    const newPrice = 30000000
    const coverage = 20
    const amount = getUpdatedPriceAmountToPayOrClaim(ticket, newPrice, coverage)
    expect(amount).toEqual(728000)
    ticket.taxationLocked = "840000"
    ticket.price = newPrice
    ticket.taxationStart = addDays(ticket.createdAt, 3)
  })
  it("should reduce coverage after the end of grace period and get refund", () => {
    jest.useFakeTimers().setSystemTime(new Date("2023-01-08T10:00:01.175Z"))
    const newPrice = 100000000
    const coverage = 3
    const amount = getUpdatedPriceAmountToPayOrClaim(ticket, newPrice, coverage)
    expect(amount).toEqual(-252000)
    ticket.taxationLocked = "420000"
    ticket.price = newPrice
    ticket.taxationStart = addDays(ticket.createdAt, 7)
  })
})

export {}
