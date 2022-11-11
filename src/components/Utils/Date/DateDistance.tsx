import { formatDistance, format } from "date-fns"
import { useMemo } from "react"

interface Props {
  timestamptz: string | Date
  append?: boolean
}
export const DateDistance = ({ timestamptz, append = false }: Props) => {
  const dist = useMemo(
    () =>
      formatDistance(new Date(timestamptz), new Date(), { addSuffix: true }),
    []
  )
  return <span title={format(new Date(timestamptz), 'MMM dd, yyyy')}>{dist}</span>
}
