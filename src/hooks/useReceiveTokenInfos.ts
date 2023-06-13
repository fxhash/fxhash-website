import { useEffect, useState, useCallback, useMemo } from "react"
import { generateFxHash, generateTzAddress } from "utils/hash"
import { RawTokenFeatures } from "types/Metadata"
import { ArtworkIframeRef } from "components/Artwork/PreviewIframe"
import { FxParamDefinition, FxParamType } from "components/FxParams/types"

export interface TokenInfo {
  version: string | null
  hash: string
  iteration: number
  minter: string
  features: RawTokenFeatures | null
  params: any | null
  paramsDefinition: any | null
}

interface IFrameTokenInfos {
  onIframeLoaded: () => void
  hash: string
  setHash: (h: string) => void
  // iteration number
  iteration: number
  setIteration: (i: number) => void
  // minter address
  minter: string
  setMinter: (minter: string) => void
  // the features
  features: RawTokenFeatures | null
  setFeatures: (f: RawTokenFeatures | null) => void
  // params enhanced with values as executed in the token
  params: any
  setParams: (p: any) => void
  // raw param definition directly from the script
  setParamsDefinition: (p: any) => void
  paramsDefinition: any
  info: TokenInfo
}

function handleOldSnippetEvents(
  e: any,
  handlers: Pick<
    IFrameTokenInfos,
    "setFeatures" | "setHash" | "setParamsDefinition" | "setParams"
  > &
    Partial<IFrameTokenInfos>
) {
  if (e.data) {
    if (e.data.id === "fxhash_getHash") {
      if (e.data.data) {
        handlers.setHash(e.data.data)
      } else {
      }
    }
    if (e.data.id === "fxhash_getFeatures") {
      if (e.data.data) {
        handlers.setFeatures(e.data.data)
      } else {
        handlers.setFeatures(null)
      }
    }
    if (e.data.id === "fxhash_getParams") {
      if (e.data.data) {
        const { definitions, values } = e.data.data
        if (definitions) {
          const definitionsWithDefaults = definitions.map(
            (d: FxParamDefinition<FxParamType>) => ({
              ...d,
              default: values?.[d.id],
            })
          )
          handlers.setParamsDefinition(definitions)
          handlers.setParams(definitionsWithDefaults)
        }
      } else {
        handlers.setParams(null)
      }
    }
  }
}

export function useReceiveTokenInfos(
  ref: React.RefObject<ArtworkIframeRef | null>,
  options?: {
    initialHash?: string
    initialIteration?: number
    initialMinter?: string
  }
): IFrameTokenInfos {
  const [info, setInfo] = useState<TokenInfo>({
    version: null,
    hash: options?.initialHash || generateFxHash(),
    iteration: options?.initialIteration || 1,
    minter: options?.initialMinter || generateTzAddress(),
    features: null,
    params: null,
    paramsDefinition: null,
  })

  const setFeatures = (features: RawTokenFeatures | null) =>
    setInfo((i) => ({
      ...i,
      features,
    }))

  const setHash = (hash: string) =>
    setInfo((i) => ({
      ...i,
      hash,
    }))

  const setIteration = (iteration: number) =>
    setInfo((i) => ({
      ...i,
      iteration,
    }))

  const setMinter = (minter: string) =>
    setInfo((i) => ({
      ...i,
      minter,
    }))

  const setParams = (params: any | null) =>
    setInfo((i) => ({
      ...i,
      params,
    }))

  const setParamsDefinition = (paramsDefinition: any | null) =>
    setInfo((i) => ({
      ...i,
      paramsDefinition,
    }))

  useEffect(() => {
    const listener = (e: any) => {
      if (e.data.id === "fxhash_getInfo") {
        const {
          version,
          params: { definitions, values },
          iteration,
          minter,
          features,
          hash,
        } = e.data.data
        setInfo({
          version,
          features,
          hash,
          iteration,
          paramsDefinition: definitions,
          minter: minter,
          params:
            definitions?.map((d: FxParamDefinition<FxParamType>) => ({
              ...d,
              default: values?.[d.id],
            })) || null,
        })
      }
      // handle deprecated events from old snippet
      handleOldSnippetEvents(e, {
        setFeatures,
        setHash,
        setParams,
        setParamsDefinition,
      })
    }
    window.addEventListener("message", listener, false)

    return () => {
      window.removeEventListener("message", listener, false)
    }
  }, [])

  const onIframeLoaded = useCallback(() => {
    if (ref.current) {
      const iframe = ref.current.getHtmlIframe()
      if (iframe) {
        iframe.contentWindow?.postMessage("fxhash_getInfo", "*")
        // handle deprecated events from old snippet
        iframe.contentWindow?.postMessage("fxhash_getFeatures", "*")
        iframe.contentWindow?.postMessage("fxhash_getParams", "*")
        iframe.contentWindow?.postMessage("fxhash_getHash", "*")
      }
    }
  }, [ref])

  const paramsWithVersion = useMemo(
    () =>
      info.params?.map((p: FxParamDefinition<FxParamType>) => ({
        ...p,
        version: info.version,
      })),
    [info.params, info.version]
  )

  return {
    onIframeLoaded,
    features: info.features,
    params: paramsWithVersion,
    hash: info.hash,
    iteration: info.iteration,
    minter: info.minter,
    paramsDefinition: info.paramsDefinition,
    setHash,
    setIteration,
    setMinter,
    setParams,
    setFeatures,
    setParamsDefinition,
    info,
  }
}
