import { ISplit } from "../../types/entities/Split"

export type TSplitsTransformer = (
  nbSplits: number,
  index: number,
) => number

export const transformSplitsEqual: TSplitsTransformer = (nb, index) => {
  return Math.floor(1000/nb)
}

export const transformSplitsSum1000: TSplitsTransformer = (nb, index) => {
  return Math.floor(1000/nb) + (index<(1000%nb) ? 1 : 0)
}