import { useEffect, useState, useCallback } from "react"
import { generateFxHash } from "utils/hash"
import { RawTokenFeatures } from "types/Metadata"
import { ArtworkIframeRef } from "components/Artwork/PreviewIframe"
import { FxParamDefinition, FxParamType } from "components/FxParams/types"

interface IFrameTokenInfos {
  onIframeLoaded: () => void
  hash: string
  setHash: (h: string) => void
  features: RawTokenFeatures | null
  setFeatures: (f: RawTokenFeatures) => void
  // params enhanced with values as executed in the token
  params: any
  setParams: (p: any) => void
  // raw param definition directly from the script
  paramsDefinition: any
}

export function useReceiveTokenInfos(
  ref: React.RefObject<ArtworkIframeRef | null>,
  options?: { initialHash?: string }
): IFrameTokenInfos {
  const [hash, setHash] = useState<string>(
    options?.initialHash || generateFxHash()
  )
  const [features, setFeatures] = useState<RawTokenFeatures | null>(null)
  const [params, setParams] = useState<any | null>(null)
  const [paramsDefinition, setParamsDefinition] = useState<any | null>(null)

  useEffect(() => {
    const listener = (e: any) => {
      if (e.data) {
        if (e.data.id === "fxhash_getHash") {
          if (e.data.data) {
            setHash(e.data.data)
          } else {
          }
        }
        if (e.data.id === "fxhash_getFeatures") {
          if (e.data.data) {
            setFeatures(e.data.data)
          } else {
            setFeatures(null)
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
              setParamsDefinition(definitions)
              setParams(definitionsWithDefaults)
            }
          } else {
            setParams(null)
          }
        }
      }
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
        iframe.contentWindow?.postMessage("fxhash_getFeatures", "*")
        iframe.contentWindow?.postMessage("fxhash_getParams", "*")
        iframe.contentWindow?.postMessage("fxhash_getHash", "*")
      }
    }
  }, [ref])

  return {
    onIframeLoaded,
    features,
    params,
    hash,
    setHash,
    setParams,
    setFeatures,
    paramsDefinition,
  }
}
