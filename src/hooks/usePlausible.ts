import { NextRouter } from "next/router"
import Plausible from "plausible-tracker"
import { useCallback, useMemo } from "react"

export interface TrackingService {
  handleTrackPageView: (router: NextRouter) => void
}

let _plausible: any

const DEBUG = process.env.NEXT_PUBLIC_DEPLOY_ENV !== "production"

export function usePlausible(): TrackingService {
  const plausible = useMemo(() => {
    if (DEBUG) return {}
    if (_plausible) return _plausible
    _plausible = Plausible({
      domain: "fxhash.xyz",
      trackLocalhost: false,
    })
    return _plausible
  }, [])

  const handleTrackPageView = useCallback(() => {
    const url = window.location.href
    if (DEBUG) {
      console.log("PLAUSIBLE DEBUG: tracking page view", url)
    } else {
      plausible.trackPageview({ trackLocalhost: false, url })
    }
  }, [plausible])

  return {
    handleTrackPageView,
  }
}
