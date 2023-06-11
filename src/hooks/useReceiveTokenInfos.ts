import { useEffect, useState, useCallback, useMemo } from "react"
import { generateFxHash, generateTzAddress } from "utils/hash"
import { RawTokenFeatures } from "types/Metadata"
import { ArtworkIframeRef } from "components/Artwork/PreviewIframe"
import { FxParamDefinition, FxParamType } from "components/FxParams/types"
import { IRuntimeContext, useRuntime } from "./useRuntime"

export interface TokenInfo {
  version: string | null
  hash: string
  minter: string
  features: RawTokenFeatures | null
  params: any | null
  paramsDefinition: any | null
}

interface IFrameTokenInfos {
  onIframeLoaded: () => void
  hash: string
  setHash: (h: string) => void
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
  runtime: IRuntimeContext
  dispatch: (id: string, data: any) => void
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
  options?: { initialHash?: string; initialMinter?: string }
): IFrameTokenInfos {
  const runtime = useRuntime()
  const { state, definition, details } = runtime

  const [info, setInfo] = useState<TokenInfo>({
    version: null,
    hash: options?.initialHash || generateFxHash(),
    minter: options?.initialMinter || generateTzAddress(),
    features: null,
    params: null,
    paramsDefinition: null,
  })

  const setFeatures = (features: RawTokenFeatures | null) =>
    definition.update({ features })

  const setHash = (hash: string) => state.update({ hash })

  const setMinter = (minter: string) => state.update({ minter })

  const setParams = (params: any | null) =>
    setInfo((i) => ({
      ...i,
      params,
    }))

  const setParamsDefinition = (definition: any | null) =>
    definition.update({ params: definition })

  useEffect(() => {
    const listener = (e: any) => {
      if (e.data.id === "fxhash_getInfo") {
        const {
          version,
          params: { definitions, values },
          minter,
          features,
          hash,
        } = e.data.data
        definition.update({ params: definitions, features, version })
        state.update({ hash, minter, params: values })
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

  const dispatch = (id: string, data: any) => {
    if (!ref.current) return
    ref.current.getHtmlIframe()?.contentWindow?.postMessage({ id, data }, "*")
  }

  return {
    onIframeLoaded,
    features: definition.features,
    params: definition.params,
    hash: state.hash,
    minter: state.minter,
    paramsDefinition: definition.params,
    setHash,
    setMinter,
    setParams,
    setFeatures,
    setParamsDefinition,
    info,
    runtime,
    dispatch,
  }
}
