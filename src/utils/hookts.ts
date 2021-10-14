import { DependencyList, EffectCallback, useCallback, useEffect, useRef } from 'react'
import useAsyncEffect from 'use-async-effect'

export function useIsMounted() {
  const isMounted = useRef(false)

  useEffect(() => {
    isMounted.current = true

    return () => {
      isMounted.current = false
    }
  }, [])

  return useCallback(() => isMounted.current, [])
}

export const useClientEffect = (effect: EffectCallback, dependencies?: DependencyList): void => {
  if (typeof window !== "undefined") {
    useEffect(effect, dependencies)
  }
}

export const useClientAsyncEffect = (effect: (isMounted: () => boolean) => unknown, dependencies?: any[]): void => {
  if (typeof window !== "undefined") {
    useAsyncEffect(effect, dependencies)
  }
}