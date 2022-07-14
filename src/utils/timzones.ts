import { getTimeZones, TimeZone } from "@vvo/tzdb";

export const timezones = getTimeZones({ includeUtc: true });

export const timezoneSearchKeys = [
  "name",
  "alternativeName",
  "abbreviation",
  "mainCities",
]

/**
 * Returns the local timezone from the timezone array, using Intl API first, and then
 * with a fallback using the timezone offset
 */
export function getLocalTimezone(): TimeZone {
  try {
    const localeTzName = Intl.DateTimeFormat().resolvedOptions().timeZone
    const found = timezones.find(timezone => timezone.name === localeTzName)
    if (found) return found
  }
  catch {}


  // if we could not identify with the timezone string indicator, use shift
  const offsetHr = -((new Date().getTimezoneOffset())) | 0
  const found = timezones.find(timezone => timezone.currentTimeOffsetInMinutes === offsetHr)
  if (found) return found

  // otherwise simply return UTC
  return timezones.find(tz => tz.name === "UTC")!
}
