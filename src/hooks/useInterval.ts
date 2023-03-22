import { useEffect } from "react"

export const useInterval = (callback: () => void, delay: number) => {
  useEffect(() => {
    if (delay !== null) {
      const id = setInterval(callback, delay)
      return () => clearInterval(id)
    }
  }, [delay])
}
