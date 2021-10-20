import { DependencyList, EffectCallback, useCallback, useEffect, useRef, useState } from 'react'
import useAsyncEffect from 'use-async-effect'
import { ContractCallHookReturn, ContractInteractionMethod, ContractOperationStatus } from '../types/Contracts'
import { MintError, MintProgressMessage, MintResponse } from '../types/Responses'

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

/**
 * Designed to interract with generic contract methods residing in the Wallet service.
 */
export function useContractCall<T>(contractMethod?: ContractInteractionMethod<T>): ContractCallHookReturn<T> {
  const [state, setState] = useState<ContractOperationStatus>(ContractOperationStatus.NONE)
  const [loading, setLoading] = useState<boolean>(false)
  const [success, setSuccess] = useState<boolean>(false)
  const [error, setError] = useState<boolean>(false)
  const counter = useRef<number>(0)
  const isMounted = useIsMounted()

  const clear = () => {
    setLoading(false)
    setSuccess(false)
    setError(false)
    setState(ContractOperationStatus.NONE)
  }

  const call = (data: T) => {
    setLoading(true)
    setSuccess(false)
    setError(false)
    setState(ContractOperationStatus.NONE)
    
    // assign the ID to this call and increment it to prevent overlaps
    counter.current++
    const id = counter.current
    contractMethod && contractMethod(data, (opState) => {
      if (counter.current === id && isMounted()) {
        setState(opState)
        if (opState === ContractOperationStatus.INJECTED) {
          setSuccess(true)
          setLoading(false)
        }
        else if (opState === ContractOperationStatus.ERROR) {
          setLoading(false)
          setError(true)
        }
      }
    })
  }

  return {
    state,
    loading,
    success,
    call,
    clear,
    error
  }
}


interface HookMintReturn {
  progress: MintProgressMessage|null
  error: MintError|null
  success: boolean
  loading: boolean
  data: MintResponse|null
  start: () => void
}

export function useMint(id: number): HookMintReturn {
  // the counter is used to keep track of the calls made, prevent overlap
  const [counter, setCounter] = useState(-1)
  const [progress, setProgress] = useState<MintProgressMessage|null>(null)
  const [error, setError] = useState<MintError|null>(null)
  const [success, setSuccess] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const [data, setData] = useState<MintResponse|null>(null)

  const start = () => {
    setCounter(counter+1)
  }

  const reset = () => {
    setProgress(null)
    setError(null)
    setSuccess(false)
    setLoading(false)
    setData(null)
  }

  // when counter changes, initiate a new call to the server
  useEffect(() => {
    if (counter >= 0) {
      // clear and start the event source
      reset()
      setLoading(true)
      const source = new EventSource(`${process.env.NEXT_PUBLIC_API_FILE_ROOT!}/mint/${id}`)

      const progressHandler = (message: MessageEvent<MintProgressMessage>) => {
        setProgress(message.data)
      }
      const errorHandler = (message: MessageEvent<MintError>) => {
        setError(message.data)
        setLoading(false)
        source.close()
      }
      const successHandler = (message: MessageEvent<any>) => {
        setSuccess(true)
        setData(JSON.parse(message.data))
        setLoading(false)
        source.close()
      }

      // @ts-ignore
      source.addEventListener("progress", progressHandler)
      // @ts-ignore
      source.addEventListener("mint-success", successHandler)
      // @ts-ignore
      source.addEventListener("mint-error", errorHandler)
      
      return () => {
        // @ts-ignore
        source.removeEventListener("progress", progressHandler)
        // @ts-ignore
        source.removeEventListener("mint-success", successHandler)
        // @ts-ignore
        source.removeEventListener("mint-error", errorHandler)
        source.close()
      }
    }
  }, [counter])

  return {
    progress,
    error,
    success,
    loading,
    data,
    start
  }
}