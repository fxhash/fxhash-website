import { utcToZonedTime, zonedTimeToUtc } from "date-fns-tz"
import { Timezone } from "./timzones"

export function isPlatformOpenedAt(date: Date, timezone: Timezone): boolean {
  const reference = utcToZonedTime(new Date(process.env.NEXT_PUBLIC_REFERENCE_OPENING!), timezone.utc[0])

  // get seconds between the 2 dates
  const diff = (date.getTime() - reference.getTime()) / 1000
  const hours = diff / 3600

  // modulo the cycle duration
  const cycleHours = hours % 23

  // if cycleHours > 12, it means that the platform should be closed, otherwise opened
  return cycleHours < 12
}

