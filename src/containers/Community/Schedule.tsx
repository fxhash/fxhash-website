import style from "./Schedule.module.scss"
import cs from "classnames"
import { ScheduleLine } from "./ScheduleLine"
import { useContext, useMemo } from "react"
import { addDays, startOfDay, subDays } from "date-fns"
import { utcToZonedTime } from "date-fns-tz"
import { CyclesContext } from "../../context/Cycles"
import { TimeZone } from "@vvo/tzdb"

interface Props {
  timezone: TimeZone
  nbDays?: number
}
export function Schedule({ timezone, nbDays = 7 }: Props) {
  // build the array of days displayed by the schedule
  const days = useMemo<Date[]>(() => {
    // now, with the timezones
    const nowTz = utcToZonedTime(new Date(), timezone.name)
    // get yesterday midnight
    const yesterday = subDays(startOfDay(nowTz), 1) // todo: replace -3 by 1
    // 7 more days starting from "yesterday"
    const ret: Date[] = [yesterday]
    for (let i = 0; i < nbDays; i++) {
      ret.push(addDays(yesterday, i + 1))
    }
    return ret
  }, [timezone, nbDays])

  // get the list of active cycles
  const { cycles } = useContext(CyclesContext)

  // the hours at the top
  const hours = useMemo<string[]>(() => {
    return Array(24)
      .fill(0)
      .map((_, i) => `${i}`.padStart(2, "0") + "h")
  }, [])

  return (
    <div className={cs(style.root)}>
      <table className={cs(style.table)} cellSpacing="0">
        <thead>
          <tr>
            <td></td>
            {hours.map((hour, idx) => (
              <td key={idx}>
                <span>{hour}</span>
              </td>
            ))}
            <td></td>
          </tr>
        </thead>
        <tbody>
          {cycles.length > 0 &&
            days.map((day, idx) => (
              <ScheduleLine
                key={idx}
                date={day}
                cycles={cycles}
                timezone={timezone}
              />
            ))}
          <tr>
            <td></td>
            {hours.map((_, idx) => (
              <td key={idx} />
            ))}
            <td></td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}
