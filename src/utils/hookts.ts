import { DependencyList, EffectCallback, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import useAsyncEffect from 'use-async-effect'
import useFetch, { CachePolicies } from 'use-http'
import { API_BLOCKCHAIN_CONTRACT_STORAGE } from '../services/Blockchain'
import { ContractCallHookReturn, ContractInteractionMethod, ContractOperationStatus } from '../types/Contracts'
import { MintError, MintProgressMessage, MintResponse } from '../types/Responses'
import { processTzProfile } from './user'

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

/**
 * useIsMounted() by triggers a state update when it mounts
 */
export function useIsMountedState(): boolean {
  const [isMounted, setIsMounted] = useState<boolean>(false)
  useEffect(() => {
    setIsMounted(true)
    return () => {
      setIsMounted(false)
    }
  }, [])
  return isMounted
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

export const useInterval = (callback: () => void, intervalMs: number, triggerStart: boolean = false) => {
  const isMounted = useIsMounted()

  useEffect(() => {
    if (triggerStart) callback()
    
    const interval = setInterval(() => {
      if (isMounted()) callback()
    }, intervalMs)
    
    return () => {
      clearInterval(interval)
    }
  }, [])
}

/**
 * Designed to interract with generic contract methods residing in the Wallet service.
 */
export function useContractCall<T>(contractMethod?: ContractInteractionMethod<T>): ContractCallHookReturn<T> {
  const [state, setState] = useState<ContractOperationStatus>(ContractOperationStatus.NONE)
  const [loading, setLoading] = useState<boolean>(false)
  const [success, setSuccess] = useState<boolean>(false)
  const [error, setError] = useState<boolean>(false)
  const [transactionHash, setTransactionHash] = useState<string|null>(null)
  const counter = useRef<number>(0)
  const isMounted = useIsMounted()

  const clear = () => {
    setLoading(false)
    setSuccess(false)
    setError(false)
    setTransactionHash(null)
    setState(ContractOperationStatus.NONE)
  }

  const call = (data: T) => {
    setLoading(true)
    setSuccess(false)
    setError(false)
    setTransactionHash(null)
    setState(ContractOperationStatus.NONE)
    
    // assign the ID to this call and increment it to prevent overlaps
    counter.current++
    const id = counter.current
    contractMethod && contractMethod(data, (opState, opData) => {
      if (counter.current === id && isMounted()) {
        setState(opState)
        if (opState === ContractOperationStatus.INJECTED) {
          setSuccess(true)
          setLoading(false)
          if (opData) {
            setTransactionHash(opData)
          }
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
    transactionHash,
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


type EventSourceState = "progress" | "error" | "success"
interface HookEventSourceReturn<T, P, E> {
  progress: P|null
  error: E|null
  success: boolean
  loading: boolean
  data: T|null
  start: () => void
}

/**
 * Hook that connects to a Server-Sent Event implementation once the start() method is
 * called. Listens to "progress", "success" and "error" event types and populate the
 * variables returned according to the state returned by the SSE.
 * @param url target URL of the event source (server implementing Server-Sent Events)
 */
export function useEventSource<T, P = string, E = string>(
  url: string, 
  dataTransform: ((data: string) => any) = (data) => data
): HookEventSourceReturn<T, P, E> {
  // the counter is used to keep track of the calls made, prevent overlap
  const [counter, setCounter] = useState(-1)
  const [progress, setProgress] = useState<P|null>(null)
  const [error, setError] = useState<E|null>(null)
  const [success, setSuccess] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const [data, setData] = useState<T|null>(null)

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
      const source = new EventSource(url)

      const progressHandler = (message: MessageEvent) => {
        setProgress(dataTransform(message.data))
      }
      const errorHandler = (message: MessageEvent) => {
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
      source.addEventListener("success", successHandler)
      // @ts-ignore
      source.addEventListener("error", errorHandler)
      
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

/**
 * Lazy loads an image 
 */
export function useLazyImage(url: string | null): boolean {
  const [loaded, setLoaded] = useState<boolean>(false)
  useEffect(() => {
    if (loaded) setLoaded(false)
    if (url) {
      const img = new Image()
      img.onload = () => {
        setLoaded(true)
      }
      img.src = url
    }
  }, [url])
  return loaded
}

/**
 * Verify a use via tz profile
 */
export function useTzProfileVerification(address: string) {
  const { data: data, post, loading } = useFetch('https://indexer.tzprofiles.com/v1/graphql', {
    cachePolicy: CachePolicies.NO_CACHE
  })
  
  useEffect(() => {
    post({
      query: `query MyQuery { tzprofiles_by_pk(account: \"${address}\") { valid_claims } }`,
      variables: null,
      operationName: 'MyQuery',
    })
  }, [])

  const tzProfileData = useMemo(() => (!!data?.data?.tzprofiles_by_pk?.valid_claims 
    && processTzProfile(data?.data?.tzprofiles_by_pk?.valid_claims)) || null, [data])

  return {
    loading, tzProfileData
  }
}


/**
 * Get contract storage
 */
 export function useContractStorage(address: string) {
  const { data, loading } = useFetch(API_BLOCKCHAIN_CONTRACT_STORAGE(address), {
    cachePolicy: CachePolicies.NO_CACHE
  }, [])

  return {
    data, loading
  }
}