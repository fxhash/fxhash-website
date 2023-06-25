import { RefObject, useEffect } from "react"

export function useMessageListener(
  eventId: string,
  listener: (e: any) => void
) {
  useEffect(() => {
    const _listener = (e: any) => {
      if (e.data.id === eventId) listener(e)
    }

    window.addEventListener("message", _listener, false)

    return () => {
      window.removeEventListener("message", _listener, false)
    }
  }, [listener])
}
