import { useEffect, useRef, useState } from "react"

/**
 * call a callback every delay ms and return the result of the callback
 */
export const useIntervalValue = <T>(callback: () => T, delay: number) => {
  const [result, setResult] = useState<any>(callback())

  /**
   * save the callback in a ref so we don't need to update the interval when
   * it changes
   */
  const refCallback = useRef(callback)

  useEffect(() => {
    refCallback.current = callback
  }, [callback])

  useEffect(() => {
    const id = setInterval(() => {
      // call the callback and update the result
      setResult(refCallback.current())
    }, delay)

    return () => clearInterval(id)
  }, [delay])

  return result
}
