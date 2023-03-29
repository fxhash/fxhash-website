import style from "./Schedule.module.scss"
import cs from "classnames"
import { useMemo } from "react"
import {
  getCycleTimeState,
  getHourDividerFromTimezoneOffset,
  ICycleTimeState,
} from "../../utils/schedule"
import {
  addHours,
  addMinutes,
  format,
  isToday,
  isTomorrow,
  isYesterday,
} from "date-fns"
import { zonedTimeToUtc } from "date-fns-tz"
import { Cycle } from "../../types/Cycles"
import { TimeZone } from "@vvo/tzdb"

interface Hour {
  time: number
  openQuarter?: number
  closeQuarter?: number
  quarters: ICycleTimeState[]
}

interface Props {
  date: Date
  cycles: Cycle[][]
  timezone: TimeZone
}
export function ScheduleLine({ date, cycles, timezone }: Props) {
  // compute if each hour is within the schedule
  const hours = useMemo<Hour[]>(() => {
    const divider = getHourDividerFromTimezoneOffset(
      timezone.currentTimeOffsetInMinutes
    )
    const quarterSize = 60 / divider
    const ret: Hour[] = []
    for (let i = 0; i < 24; i++) {
      const currentHour = addHours(date, i)
      const hour: Hour = {
        time: i,
        openQuarter: undefined,
        closeQuarter: undefined,
        quarters: [],
      }
      for (let j = 0; j < divider; j++) {
        const currentQuarter = addMinutes(currentHour, j * quarterSize)
        const quarter = getCycleTimeState(currentQuarter, cycles, timezone)
        if (quarter.opened) {
          if (hour.openQuarter === undefined) hour.openQuarter = j
          hour.closeQuarter = j
        }
        hour.quarters.push(quarter)
      }
      ret.push(hour)
    }
    return ret
  }, [date, timezone, cycles])

  const formatName = useMemo(() => {
    // if date is today, yesterday or tomorrow, return this
    if (isYesterday(zonedTimeToUtc(date, timezone.name))) return "yesterday"
    if (isToday(zonedTimeToUtc(date, timezone.name))) return "today"
    if (isTomorrow(zonedTimeToUtc(date, timezone.name))) return "tomorrow"
    return format(date, "EEEE")
  }, [date, timezone])

  const formatDate = useMemo(() => {
    return format(date, "dd/MM/yyyy")
  }, [date])

  const isDayToday = useMemo(
    () => isToday(zonedTimeToUtc(date, timezone.name)),
    [date, timezone]
  )

  return (
    <tr className={cs({ [style.today]: isDayToday })}>
      <td className={cs(style.date_name)}>
        <div>
          <span>{formatName}</span>
          <span className={cs(style.date)}>{formatDate}</span>
        </div>
      </td>
      {hours.map((hour, idx) => (
        <td key={hour.time}>
          <div className={cs(style.square)}>
            {hour.quarters.map((quarter, idxQ) => (
              <div
                key={`${hour.time}${idxQ}`}
                className={cs(style.quarter, {
                  [style.active]: quarter.opened,
                  [style["border-left"]]: idxQ > 0 && hour.openQuarter === idxQ,
                  [style["border-right"]]:
                    idxQ < hour.quarters.length - 1 &&
                    hour.closeQuarter === idxQ,
                })}
              />
            ))}
          </div>
        </td>
      ))}
      <td>
        <div className={cs(style.square)} />
      </td>
    </tr>
  )
}
