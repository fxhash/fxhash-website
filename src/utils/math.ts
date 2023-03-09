// clamps a value x in the range [min, max]
export const clamp = (x: number, min: number, max: number) =>
  Math.max(min, Math.min(max, x))

export const lerp = (a: number, b: number, t: number) => (b - a) * t + a

export function getMutezDecimalsNb(x: number): number {
  const mu = Math.floor(Math.abs(x))
  const st = (mu / 1000000).toString()
  const split = st.split(".")
  return split.length > 1 ? split.pop()?.length || 0 : 0
}

export function getDecimalsNumber(x: number): number {
  return x.toString().split(".").pop()?.length || 0
}

export function isPositive(value: number | undefined): boolean {
  return typeof value !== "undefined"
    ? value >= parseFloat(process.env.NEXT_PUBLIC_GT_MIN_PRICE!)
    : true
}

export function getNumberWithOrdinal(n: number) {
  const s = ["th", "st", "nd", "rd"],
    v = n % 100
  return n + (s[(v - 20) % 10] || s[v] || s[0])
}

const getDailyHarbergerTax = (price: number) => {
  return price * 0.0014
}
export function getMintTicketHarbergerTax(price: number, days: number) {
  return getDailyHarbergerTax(price) * days
}
export function getDaysCoveredByHarbergerTax(
  totalTaxPaid: number,
  price: number
) {
  return totalTaxPaid / getDailyHarbergerTax(price)
}
