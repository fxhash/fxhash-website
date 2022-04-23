import { addMinutes } from "date-fns/esm"
import { useEffect, useState } from "react"
import useAsyncEffect from "use-async-effect"
import { distanceSecondsClamped } from "../../utils/time"

interface Props {
  until: Date
  showFull?: boolean
  onEnd?: () => void
}
export function Countdown({
  until,
  showFull = false,
  onEnd,
}: Props) {
  const [distanceSeconds, setDistanceSeconds] = useState<number>(
    distanceSecondsClamped(new Date(), until)
  )

  useAsyncEffect((isMounted) => {
    // optimisation for 1h + timers (no need for 1s refresh)
    const dist = distanceSecondsClamped(new Date(), until)

    const interval = setInterval(() => {
      if (isMounted()) {
        const D = distanceSecondsClamped(new Date(), until)
        setDistanceSeconds(D)
        if (D <= 0) {
          clearInterval(interval)
          onEnd?.()
        }
      }
      else {
        clearInterval(interval)
      }
    }, (dist > 7200 && !showFull) ? 60000 : 1000)

    return () => {
      clearInterval(interval)
    }
  }, [until])

  const seconds = distanceSeconds % 60
  const minutes = ((distanceSeconds-seconds)/60) % 60
  const hours = ((distanceSeconds - minutes*60 - seconds) / 3600) % 24
  const days = Math.floor(distanceSeconds/(60*60*24))

  return (
    <span>
      {days > 0 && <span>{days}d </span>}
      {hours > 0 && <span>{hours}h </span>}
      {(days < 1 && minutes > 0) && <span>{minutes}min </span>}
      {(hours < 1 || showFull) && <span>{seconds}s</span>}
    </span>
  )
}