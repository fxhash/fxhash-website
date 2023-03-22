import { useEffect, useRef, useState } from "react"

/**
 * call a callback every delay ms and return the result of the callback
 */
export const useCallbackInterval = (callback: () => void, delay: number) => {
  const [result, setResult] = useState<any>(callback())

  useEffect(() => {
    const id = setInterval(() => {
      setResult(callback())
    }, delay)
    return () => clearInterval(id)
  }, [delay])

  return result
}
