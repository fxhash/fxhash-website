import style from "./Schedule.module.scss"
import cs from "classnames"
import { useMemo } from "react"
import { areCyclesOpenedAt, getCycleTimeState, ICycleTimeState } from "../../utils/schedule"
import { addHours, format, isToday, isTomorrow, isYesterday } from "date-fns"
import { Timezone } from "../../utils/timzones"
import { zonedTimeToUtc } from "date-fns-tz"
import { Cycle } from "../../types/Cycles"


interface Props {
  date: Date
  cycles: Cycle[][]
  timezone: Timezone
}
export function ScheduleLine({ date, cycles, timezone }: Props) {
  // compute if each hour is within the schedule
  const hours = useMemo<ICycleTimeState[]>(() => {
    const ret: ICycleTimeState[] = []
    for (let i = 0; i < 24; i++) {
      ret.push(getCycleTimeState(addHours(date, i), cycles, timezone))
    }
    return ret
  }, [date, timezone, cycles])

  const formatName = useMemo(() => {
    // if date is today, yesterday or tomorrow, return this
    if (isYesterday(zonedTimeToUtc(date, timezone.utc[0]))) return "yesterday"
    if (isToday(zonedTimeToUtc(date, timezone.utc[0]))) return "today"
    if (isTomorrow(zonedTimeToUtc(date, timezone.utc[0]))) return "tomorrow"
    return format(date, "EEEE")
  }, [date, timezone])

  const formatDate = useMemo(() => {
    return format(date, "dd/MM/yyyy")
  }, [date, timezone])

  const isDayToday = useMemo(() => isToday(zonedTimeToUtc(date, timezone.utc[0])), [date, timezone])

  return (
    <tr className={cs({ [style.today]: isDayToday })}>
      <td className={cs(style.date_name)}>
        <div className={cs(style.square)}>
          <span>{ formatName }</span>
          <span className={cs(style.date)}>{ formatDate }</span>
        </div>
      </td>
      {hours.map((hour, idx) => (
        <td key={idx} className={cs({ [style.active]: hour.opened })}>
          <div className={cs(style.square)}/>
        </td>
      ))}
      <td>
        <div className={cs(style.square)}/>
      </td>
    </tr>
  )
}