import { useEffect, useMemo } from "react"
import { TzktOperation } from "types/Tzkt"
import { CachePolicies, useFetch } from "use-http"

const useOnChainData = <T>(
  opHash: string | null,
  transform?: (ops: TzktOperation[]) => T
) => {
  const {
    get,
    data: requestData,
    loading,
    error,
  } = useFetch(`${process.env.NEXT_PUBLIC_TZKT_API}operations`, {
    cachePolicy: CachePolicies.NETWORK_ONLY,
  })

  useEffect(() => {
    if (!opHash) return
    get(`/${opHash}`)
  }, [opHash])

  const data = useMemo(() => {
    if (loading || !requestData) return null
    return transform?.(requestData) || requestData
  }, [requestData, transform])

  return {
    data,
    loading,
    error,
  }
}

const getIteration = (ops: TzktOperation[]) => {
  const gentkMintOp = ops.find((op) => !!op.parameter?.value.iteration)
  if (!gentkMintOp) throw new Error("No mint op found")
  return gentkMintOp.parameter.value.iteration
}

export { useOnChainData, getIteration }
