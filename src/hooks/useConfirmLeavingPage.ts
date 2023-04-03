import { useCallback, useEffect } from "react"
import { off, on } from "../utils/events"
import { useRouter } from "next/router"

export const useBeforeUnload = (
  enabled: boolean | (() => boolean) = true,
  message?: string
) => {
  const handler = useCallback(
    (event: BeforeUnloadEvent) => {
      const finalEnabled = typeof enabled === "function" ? enabled() : true
      if (!finalEnabled) {
        return
      }
      event.preventDefault()
      if (message) {
        event.returnValue = message
      }
      return message
    },
    [enabled, message]
  )

  useEffect(() => {
    if (!enabled) {
      return
    }
    on(window, "beforeunload", handler)
    return () => off(window, "beforeunload", handler)
  }, [enabled, handler])
}

const useConfirmLeavingPage = (
  enabled = true,
  message = "Are you sure want to leave this page?"
) => {
  const router = useRouter()
  useBeforeUnload(enabled, message)

  useEffect(() => {
    const handler = (url: string, { shallow }: { shallow: boolean }) => {
      if (enabled && !window.confirm(message)) {
        router.events.emit("routeChangeError", "routeChange aborted.", url, {
          shallow,
        })
        throw "routeChange aborted."
      }
    }
    router.events.on("routeChangeStart", handler)
    return () => {
      router.events.off("routeChangeStart", handler)
    }
  }, [enabled, message, router.events])
}
export default useConfirmLeavingPage
