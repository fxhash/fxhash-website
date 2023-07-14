import Matomo from "matomo-tracker"
import { useMemo, useCallback } from "react"
import { TrackingService } from "./usePlausible"

let _matomo: any

const DEBUG = process.env.NEXT_PUBLIC_DEPLOY_ENV !== "production"

export function useMatomo(): TrackingService {
  const matomo = useMemo(() => {
    // we don't init a matomo instance when DEBUG
    if (DEBUG) return {}
    if (_matomo) return _matomo
    _matomo = Matomo(1, "https://fxhashxyz.matomo.cloud/matomo.php")
    return _matomo
  }, [])

  const handleTrackPageView = useCallback(() => {
    const url = window.location.href
    if (DEBUG) {
      console.log("MATOMO DEBUG: tracking page view", url)
    } else {
      matomo.track(url)
    }
  }, [matomo])

  return {
    handleTrackPageView,
  }
}
