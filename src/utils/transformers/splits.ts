import { ISplit } from "../../types/entities/Split"

export type TSplitsTransformer = (
  splits: any[],
  index: number,
) => number

export const transformSplitsEqual: TSplitsTransformer = (splits, index) => {
  return Math.floor(1000/splits.length)
}

export const transformSplitsSum1000: TSplitsTransformer = (splits, index) => {
  return Math.floor(1000/splits.length) + (index<(1000%splits.length) ? 1 : 0)
}

export const transformSplitsAccessList: TSplitsTransformer = (splits, index) => {
  return splits[index].pct
}