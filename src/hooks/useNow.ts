import { useEffect, useState } from "react"

export default function useNow(refreshEveryMs: number): Date {
  const [now, setNow] = useState<Date>(new Date())

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date())
    }, refreshEveryMs)
    return () => {
      clearInterval(interval)
    }
  }, [refreshEveryMs])

  return now
}
