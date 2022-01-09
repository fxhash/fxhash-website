import { addMinutes } from "date-fns/esm"
import { useEffect, useState } from "react"
import { distanceSecondsClamped } from "../../utils/time"

interface Props {
  until: Date
  onEnd?: () => void
}
export function Countdown({
  until,
  onEnd,
}: Props) {
  const [distanceSeconds, setDistanceSeconds] = useState<number>(distanceSecondsClamped(new Date(), until))

  useEffect(() => {
    const interval = setInterval(() => {
      const D = distanceSecondsClamped(new Date(), until)
      setDistanceSeconds(D)
      if (D <= 0) {
        onEnd?.()
        clearInterval(interval)
      }
    }, 1000)

    return () => {
      clearInterval(interval)
    }
  }, [until])

  const seconds = distanceSeconds % 60
  const minutes = ((distanceSeconds-seconds)/60) % 60
  const hours = (distanceSeconds - minutes*60 - seconds) / 3600

  return (
    <span>
      {hours > 0 && <span>{hours}h </span>}
      {minutes > 0 && <span>{minutes}min </span>}
      {<span>{seconds}s</span>}
    </span>
  )
}