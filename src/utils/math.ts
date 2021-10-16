// clamps a value x in the range [min, max]
export const clamp = (x: number, min: number, max: number) => Math.max(min, Math.min(max, x))