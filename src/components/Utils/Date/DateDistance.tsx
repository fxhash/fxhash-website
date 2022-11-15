import { format, formatDistance } from "date-fns"
import { useMemo } from "react"

interface Props {
  timestamptz: string | Date
  append?: boolean
}
export const DateDistance = ({ timestamptz, append = false }: Props) => {
  const data = useMemo(() => {
    const dateTz = new Date(timestamptz)
    return {
      title: format(dateTz, "MMM dd, yyyy 'at' HH:mm"),
      dist: formatDistance(dateTz, new Date(), {
        addSuffix: true,
      }),
    }
  }, [])
  return <span title={data.title}>{data.dist}</span>
}
