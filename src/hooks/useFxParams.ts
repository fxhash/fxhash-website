import { FxParamDefinition } from "components/FxParams/types"
import {
  deserializeParams,
  serializeParams,
  stringifyParamsData,
} from "components/FxParams/utils"
import { useRouter } from "next/router"
import { useEffect, useMemo, useState } from "react"
import { generateFxHash } from "utils/hash"
import { useEffectAfterRender } from "./useEffectAfterRender"

/**
 * hook to manage fx(params) state, maintaining it in the query params
 */
export const useFxParams = (params: FxParamDefinition<any>[]) => {
  const router = useRouter()
  const { query } = router

  const [hash, setHash] = useState((query.fxhash as string) || generateFxHash())
  const [data, setData] = useState({})
  const [inputBytes, setInputBytes] = useState(
    (query.fxparams as string) || null
  )

  const updateQueryParams = (query: { fxhash: string; fxparams: string }) =>
    router.replace(
      {
        query: {
          ...router.query,
          ...query,
        },
      },
      undefined,
      { shallow: true }
    )

  useEffectAfterRender(() => {
    // wait until params are loaded
    if (!inputBytes) return

    // update query params with new hash and input bytes
    updateQueryParams({ fxhash: hash, fxparams: inputBytes })
  }, [hash, inputBytes])

  // use usememo maybe
  useEffect(() => {
    const serialized = serializeParams(data, params || [])
    if (serialized.length === 0) return
    setInputBytes(serialized)
  }, [stringifyParamsData(data), params])

  return {
    hash,
    setHash,
    data,
    setData,
    inputBytes,
  }
}
