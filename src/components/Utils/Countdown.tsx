import { addMinutes } from "date-fns/esm"
import { useEffect, useState } from "react"
import useAsyncEffect from "use-async-effect"
import { distanceSecondsClamped } from "../../utils/time"

interface Props {
  until: Date
}
export function Countdown({
  until,
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
        }
      }
      else {
        clearInterval(interval)
      }
    }, dist > 7200 ? 60000 : 1000)

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
      {hours < 1 && <span>{seconds}s</span>}
    </span>
  )
}