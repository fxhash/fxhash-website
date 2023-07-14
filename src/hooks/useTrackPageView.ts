import { useCallback, useEffect } from "react"
import { NextRouter, useRouter } from "next/router"

export function useTrackPageView(
  onRouteChangeComplete: (router: NextRouter) => void
) {
  const router = useRouter()

  const handleRouteChangeComplete = useCallback(() => {
    onRouteChangeComplete(router)
  }, [router, onRouteChangeComplete])

  useEffect(() => {
    router.events.on("routeChangeComplete", handleRouteChangeComplete)
    return () => {
      router.events.off("routeChangeComplete", handleRouteChangeComplete)
    }
  }, [router, handleRouteChangeComplete])

  // trigger on mount to track entry point page view
  useEffect(() => {
    handleRouteChangeComplete()
  }, [])
}
