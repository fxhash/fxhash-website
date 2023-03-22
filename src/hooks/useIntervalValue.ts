import { useCallback, useEffect, useRef, useState } from "react"

/**
 * call a callback every delay ms and return the result of the callback
 */
export const useIntervalValue = <T>(callback: () => T, delay: number) => {
  const [result, setResult] = useState<any>(callback())

  /**
   * save the callback in a ref so we don't need to update the interval when
   * it changes
   */
  const savedCallback = useCallback(callback, [callback])

  useEffect(() => {
    const id = setInterval(() => {
      // call the callback and update the result
      setResult(savedCallback())
    }, delay)

    return () => clearInterval(id)
  }, [delay, savedCallback])

  return result
}
