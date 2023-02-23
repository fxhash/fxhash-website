import { DependencyList, useEffect, useRef } from "react"
import { useClientAsyncEffect } from "../utils/hookts"

type TAsyncIntervalCallback = () => Promise<() => void>

/**
 * Runs an async callback periodically.
 * The callback should return a function which will be called if the component
 * is still mounted.
 */
export function useAsyncInterval(
  callback: TAsyncIntervalCallback,
  delayMs: number,
  deps: DependencyList
) {
  const savedCallback = useRef<TAsyncIntervalCallback>()

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback
  }, [callback])

  useClientAsyncEffect(
    async (isMounted) => {
      let id: any = null

      const tick = async () => {
        if (savedCallback.current) {
          const fn = await savedCallback.current()
          if (isMounted()) {
            fn()
          }
        }
        id = setTimeout(tick, delayMs)
      }

      tick()

      return () => {
        if (id !== null) clearTimeout(id)
      }
    },
    [delayMs, ...deps]
  )
}
