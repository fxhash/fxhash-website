// clamps a value x in the range [min, max]
export const clamp = (x: number, min: number, max: number) => Math.max(min, Math.min(max, x))

export function getMutezDecimalsNb(x: number): number {
  const mu = Math.floor(Math.abs(x))
  const st = (mu/1000000).toString()
  return st.split(".").pop()?.length || 0
}

export function isPositive(value: number|undefined): boolean {
  return typeof(value) !== "undefined" ? value >= parseFloat(process.env.NEXT_PUBLIC_GT_MIN_PRICE!) : true
}