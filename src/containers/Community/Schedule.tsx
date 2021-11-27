import style from "./Schedule.module.scss"
import cs from "classnames"
import { ScheduleLine } from "./ScheduleLine"
import { useMemo } from "react"
import { addDays, startOfDay, subDays } from "date-fns"
import { Timezone } from "../../utils/timzones"
import { utcToZonedTime, zonedTimeToUtc } from "date-fns-tz"


interface Props {
  timezone: Timezone
}
export function Schedule({ timezone }: Props) {
  // build the array of days displayed by the schedule
  const days = useMemo<Date[]>(() => {
    // now, with the timezone
    const nowTz = utcToZonedTime(new Date(), timezone.utc[0])
    // get yesterday midnight
    const yesterday = subDays(startOfDay(nowTz), 1)   // todo: replace -3 by 1
    // 7 more days starting from "yesterday"
    const ret: Date[] = [ yesterday ]
    for (let i = 0; i < 7; i++) {
      ret.push(addDays(yesterday, i+1))
    }
    return ret
  }, [timezone])

  // the hours at the top
  const hours = useMemo<string[]>(() => {
    return Array(24).fill(0).map((_, i) => `${i}`.padStart(2, "0")+"h")
  }, [])

  return (
    <div className={cs(style.root)}>
      <table className={cs(style.table)} cellSpacing="0">
        <thead>
          <tr>
            <td></td>
            {hours.map((hour, idx) => (
              <td key={idx}><span>{ hour }</span></td>
            ))}
            <td></td>
          </tr>
        </thead>
        <tbody>
          {days.map((day, idx) => (
            <ScheduleLine
              key={idx}
              date={day}
              timezone={timezone}
            />
          ))}
          <tr>
            <td></td>
            {hours.map((_, idx) => (<td key={idx}/>))}
            <td></td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}