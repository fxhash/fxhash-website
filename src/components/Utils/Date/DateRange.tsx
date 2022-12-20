import { useMemo } from "react"
import { DateFormatted } from "./DateFormat"
interface DateRangeProps {
  startDate: string
  endDate: string
}

export function DateRange(props: DateRangeProps) {
  const { startDate, endDate } = props
  const dateStart = useMemo(() => new Date(startDate), [startDate])
  const dateEnd = useMemo(() => new Date(endDate), [endDate])
  const [formatStart, addComma] = useMemo<[string, boolean]>(() => {
    let format = `do`
    const sameMonth = dateStart.getMonth() === dateEnd.getMonth()
    const sameYear = dateStart.getFullYear() === dateEnd.getFullYear()
    if (!sameYear || !sameMonth) format += " MMMM"
    if (!sameYear) format += " yyyy"
    format += " - "
    return [format, sameYear]
  }, [dateStart, dateEnd])
  return (
    <>
      <DateFormatted format={formatStart} date={startDate} />
      <DateFormatted
        format={`do MMMM${addComma ? "," : ""} yyyy`}
        date={endDate}
      />
    </>
  )
}
