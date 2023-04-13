import { TzktBigmapDiff } from "../types/Tzkt"

/**
 * Given a list of BigMap diffs, returns the diff identified by a given path
 */
export function getDiffByPath<K = any, V = any>(
  diffs: TzktBigmapDiff[],
  path: string
): TzktBigmapDiff<K, V> | undefined {
  const diff = diffs.find((d) => d.path === path)
  return diff
}
