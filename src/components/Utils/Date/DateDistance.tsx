import { useMemo } from "react"
import { format, formatDistance } from "date-fns"

interface Props {
  timestamptz: string | Date
  append?: boolean
  shorten?: boolean
}

const abbreviate = (str: string) => {
  const abbreviations = {
    " minutes": "m",
    " minute": "m",
    " hours": "h",
    " hour": "h",
    " days": "d",
    " day": "d",
    " months": "mo",
    " month": "mo",
    " years": "y",
    " year": "y",
    "about ": "",
  }

  return Object.entries(abbreviations).reduce(
    (acc, [key, value]) => acc.replace(key, value),
    str
  )
}

export const DateDistance = ({
  timestamptz,
  append = false,
  shorten = false,
}: Props) => {
  const data = useMemo(() => {
    const dateTz = new Date(timestamptz)
    return {
      title: format(dateTz, "MMM dd, yyyy 'at' HH:mm"),
      dist: formatDistance(dateTz, new Date(), {
        addSuffix: true,
      }),
    }
  }, [timestamptz])

  const dist = useMemo(() => {
    return shorten ? abbreviate(data.dist) : data.dist
  }, [data.dist, shorten])

  return <span title={data.title}>{dist}</span>
}
