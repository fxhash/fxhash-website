/**
 * Given a date, outputs the distance in seconds to that date, clamped to 0
 */
export function distanceSecondsClamped(dateA: Date, dateB: Date): number {
  const now = new Date()
  // @ts-ignore
  const diff = Math.max(0, (dateB - dateA) / 1000) | 0
  return diff
}
