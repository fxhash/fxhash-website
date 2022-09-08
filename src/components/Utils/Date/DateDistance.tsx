import { formatDistance } from "date-fns"
import { useMemo } from "react"

interface Props {
  timestamptz: string,
  append?: boolean
}
export const DateDistance = ({ 
  timestamptz, 
  append = false 
}: Props) => {
  const dist = useMemo(
    () => formatDistance(new Date(timestamptz), new Date(), { addSuffix: true }),
    []
  )
  return <span>{ dist }</span>
}