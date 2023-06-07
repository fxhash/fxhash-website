import { useEffect } from "react"
import { TzktOperation } from "types/Tzkt"
import { CachePolicies, useFetch } from "use-http"

export const useOnChainData = <T>(
  opHash: string | null,
  transform?: (ops: TzktOperation[]) => T
) => {
  const { get, data, loading, error } = useFetch(
    process.env.NEXT_PUBLIC_TZKT_API,
    {
      cachePolicy: CachePolicies.NETWORK_ONLY,
    }
  )

  useEffect(() => {
    if (!opHash) return
    get(`/operations/${opHash}`)
  }, [opHash])

  return {
    data: transform?.(data) || data,
    loading,
    error,
  }
}
