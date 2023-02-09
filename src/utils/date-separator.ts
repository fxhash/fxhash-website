import {
  isThisMonth,
  isToday,
  isTomorrow,
  format,
  isSameDay,
  isThisYear,
  isSameMonth,
  isSameYear,
} from "date-fns"

/**
 * Given a date and a DateSeparator tracking data, it will calculate if you need to display a separator
 * Separators are:
 * - Today
 * - Tomorrow
 * - Any date in the current month (ex: 23. Dec)
 * - Any month after the current month
 * - Any year
 */

const separators = {
  today: 1,
  tomorrow: 2,
  currentMonth: 3,
  otherMonths: 4,
  years: 5,
}
export interface DateSeparatorTracking {
  currentSeparator: null | keyof typeof separators
  currentMonth: boolean
  lastDate: Date
  otherMonths: boolean
  years: boolean
}

export const getNewDateSeparatorTracking = (): DateSeparatorTracking => ({
  currentSeparator: null,
  currentMonth: false,
  lastDate: new Date(),
  otherMonths: false,
  years: false,
})

interface GetDateSeparatorPayload {
  dateSeparatorTracking: DateSeparatorTracking
  separatorLabel: string | null
}
type GetDateSeparator = (
  dateSeparatorTracking: DateSeparatorTracking,
  todayDate: Date,
  testedDate: Date
) => GetDateSeparatorPayload
export const getDateSeparator: GetDateSeparator = (
  dateSeparatorTracking,
  todayDate,
  testedDate
) => {
  const payload: GetDateSeparatorPayload = {
    dateSeparatorTracking: { ...dateSeparatorTracking },
    separatorLabel: null,
  }
  const { currentSeparator } = payload.dateSeparatorTracking
  const separatorNb = currentSeparator ? separators[currentSeparator] : 0
  if (isToday(testedDate)) {
    if (separatorNb < separators.today) {
      payload.separatorLabel = "today"
    }
    payload.dateSeparatorTracking.currentSeparator = "today"
    return payload
  }
  if (isTomorrow(testedDate)) {
    if (separatorNb < separators.tomorrow) {
      payload.separatorLabel = "tomorrow"
    }
    payload.dateSeparatorTracking.currentSeparator = "tomorrow"
    return payload
  }
  if (isThisMonth(testedDate)) {
    if (
      separatorNb <= separators.currentMonth &&
      !isSameDay(payload.dateSeparatorTracking.lastDate, testedDate)
    ) {
      payload.separatorLabel = `${format(testedDate, "d. MMM")}`
    }
    payload.dateSeparatorTracking.lastDate = testedDate
    payload.dateSeparatorTracking.currentSeparator = "currentMonth"
    return payload
  }
  if (isThisYear(testedDate)) {
    if (
      separatorNb <= separators.otherMonths &&
      !isSameMonth(payload.dateSeparatorTracking.lastDate, testedDate)
    ) {
      payload.separatorLabel = `${format(testedDate, "MMMM")}`
    }
    payload.dateSeparatorTracking.lastDate = testedDate
    payload.dateSeparatorTracking.currentSeparator = "otherMonths"
    return payload
  }
  if (!isSameYear(payload.dateSeparatorTracking.lastDate, testedDate)) {
    payload.separatorLabel = `${format(testedDate, "y")}`
  }
  payload.dateSeparatorTracking.lastDate = testedDate
  payload.dateSeparatorTracking.currentSeparator = "years"
  return payload
}
