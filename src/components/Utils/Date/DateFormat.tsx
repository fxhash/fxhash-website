import { useMemo } from "react"
import { format as dateFormat } from "date-fns"

interface Props {
  date: string
  format?: string
}
export function DateFormatted({
  date,
  format = "MMMM d, yyyy' at 'HH:mm",
}: Props) {
  const formatted = useMemo(
    () => dateFormat(new Date(date), format),
    [date, format]
  )
  return <>{formatted}</>
}
