import { useEffect, useCallback } from "react"
import { RawTokenFeatures } from "types/Metadata"
import { ArtworkIframeRef } from "components/Artwork/PreviewIframe"
import {
  FxParamDefinition,
  FxParamType,
  FxParamsData,
} from "components/FxParams/types"
import { IRuntimeContext, useRuntime } from "./useRuntime"

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
  runtime: IRuntimeContext
  dispatchEvent: (id: string, data: any) => void
  softUpdateParams: (params: FxParamsData) => void
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
          handlers.setParamsDefinition(definitionsWithDefaults)
          handlers.setParams(values)
        }
      } else {
        handlers.setParams(null)
      }
    }
  }
}

export function useReceiveTokenInfos(
  ref: React.RefObject<ArtworkIframeRef | null>,
): IFrameTokenInfos {
  const runtime = useRuntime()
  const { state, definition } = runtime

  const setFeatures = (features: RawTokenFeatures | null) =>
    definition.update({ features })

  const setHash = (hash: string) => state.update({ hash })

  const setIteration = (iteration: number) => state.update({ iteration })

  const setMinter = (minter: string) => state.update({ minter })

  const setParams = (params: any | null) => state.update({ params })

  const setParamsDefinition = (params: any | null) =>
    definition.update({ params })

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
        runtime.update({
          state: {
            hash,
            minter,
            iteration: parseInt(iteration),
            params: values,
          },
          definition: { params: definitions, features, version },
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

  const dispatchEvent = (id: string, data: any) => {
    if (!ref.current) return
    ref.current.getHtmlIframe()?.contentWindow?.postMessage({ id, data }, "*")
  }

  const softUpdateParams = (params: FxParamsData) => {
    state.update({ params })
    dispatchEvent("fxhash_params:update", { params })
  }

  return {
    onIframeLoaded,
    features: definition.features,
    params: state.params,
    hash: state.hash,
    iteration: state.iteration,
    minter: state.minter,
    paramsDefinition: definition.params,
    setHash,
    setIteration,
    setMinter,
    setParams,
    setFeatures,
    setParamsDefinition,
    runtime,
    dispatchEvent,
    softUpdateParams,
  }
}
