import { merge, cloneDeep, debounce } from "lodash"
import { useEffect, useState, useCallback, useMemo, useRef } from "react"
import { generateFxHash, generateTzAddress } from "utils/hash"
import { RawTokenFeatures } from "types/Metadata"
import { ArtworkIframeRef } from "components/Artwork/PreviewIframe"
import {
  FxParamDefinition,
  FxParamDefinitions,
  FxParamType,
  FxParamsData,
} from "components/FxParams/types"
import {
  IRuntimeContext,
  hashRuntimeHardState,
  hashRuntimeState,
  useRuntime,
} from "./useRuntime"
import {
  buildParamsObject,
  serializeParams,
  serializeParamsOrNull,
} from "components/FxParams/utils"
import { ipfsUrlWithHashAndParams } from "utils/ipfs"
import { DeepPartial } from "types/DeepPartial"

/**
 * The Runtime Controller provides a low-level API to interact with an iframe
 * and control its runtime with granularity.
 * It is responsible for handling the state of the runtime as well as the state
 * being manipulated ensuring a proper sync of the <iframe> with the params
 * when needed, depending on the viewing settings and the param settings.
 */

interface IRuntimeControllerOutput {
  // the underlying runtime state, reflects what's currently loaded in iframe
  runtime: IRuntimeContext
  // the controls layer, can be used to perform manipulations on the runtime,
  // also exposes control-state UI
  controls: IControls
  // some extra details about the runtime, etc...
  details: {
    activeUrl: string
    controlsUrl: string
    runtimeSynced: boolean
  }
}

interface IControlState {
  params: {
    definition: FxParamDefinitions | null
    values: FxParamsData
  }
}

interface IControlDetails {
  params: {
    inputBytes: string | null
  }
  stateHash: {
    hard: string
    soft: string
  }
}

interface IControls {
  state: IControlState
  details: IControlDetails
  updateParams: (params: Partial<FxParamsData>, forceRefresh?: boolean) => void
  dispatchEvent: (id: string, data: any) => void
  hardSync: () => void
  refresh: () => void
}

function handleOldSnippetEvents(e: any, runtime: IRuntimeContext) {
  if (e.data) {
    if (e.data.id === "fxhash_getHash") {
      if (e.data.data) {
        runtime.state.update({ hash: e.data.data })
      } else {
      }
    }
    if (e.data.id === "fxhash_getFeatures") {
      if (e.data.data) {
        runtime.definition.update({ features: e.data.data })
      } else {
        runtime.definition.update({ features: null })
      }
    }
    if (e.data.id === "fxhash_getParams") {
      if (e.data.data) {
        const { definitions, values } = e.data.data
        if (definitions) {
          runtime.update({
            state: {
              params: values,
            },
            definition: {
              params: definitions,
            },
          })
        }
      } else {
        runtime.update({
          state: {
            params: {},
          },
          definition: {
            params: null,
          },
        })
      }
    }
  }
}

interface IProjectState {
  cid: string
  hash?: string
  minter?: string
  inputBytes?: string
}

interface IRuntimeOptions {
  autoRefresh: boolean
}

const defaultRuntimeOptions: IRuntimeOptions = {
  autoRefresh: false,
}

type TUseRuntimeController = (
  ref: React.RefObject<ArtworkIframeRef | null>,
  project: IProjectState,
  options?: DeepPartial<IRuntimeOptions>
) => IRuntimeControllerOutput

export const useRuntimeController: TUseRuntimeController = (
  ref,
  project,
  opts
) => {
  // options
  const options = { ...defaultRuntimeOptions, ...opts }

  // the runtime state -> controls the state connected to the iframe
  const runtime = useRuntime({
    state: {
      hash: project.hash || generateFxHash(),
      minter: project.minter || generateTzAddress(),
    },
  })

  // the control state -> used to control the iframe
  const [controls, setControls] = useState<IControlState>({
    params: {
      definition: null,
      values: {},
    },
  })

  // add a listener for receiving infos from the iframe
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
        runtime.update({
          state: { hash, minter, params: values },
          definition: { params: definitions, features, version },
        })
      }
      // handle deprecated events from old snippet
      handleOldSnippetEvents(e, runtime)
    }
    window.addEventListener("message", listener, false)

    return () => {
      window.removeEventListener("message", listener, false)
    }
  }, [])

  // trigger the dispatch of events to get project details
  useEffect(() => {
    const iframe = ref.current?.getHtmlIframe()
    if (iframe) {
      const onload = () => {
        iframe.contentWindow?.postMessage("fxhash_getInfo", "*")
        // handle deprecated events from old snippet
        iframe.contentWindow?.postMessage("fxhash_getFeatures", "*")
        iframe.contentWindow?.postMessage("fxhash_getParams", "*")
        iframe.contentWindow?.postMessage("fxhash_getHash", "*")
      }
      iframe.addEventListener("load", onload, true)
      return () => iframe.removeEventListener("load", onload, true)
    }
  }, [ref])

  // whenever a change in the params definition is observed, the params control
  // object is refreshed and rebuilt: ensure consistancy
  useEffect(() => {
    setControls({
      ...controls,
      params: {
        definition: runtime.definition.params,
        values: runtime.definition.params
          ? buildParamsObject(runtime.definition.params, runtime.state.params)
          : {},
      },
    })
  }, [runtime.details.definitionHash.params])

  const dispatchEvent = (id: string, data: any) => {
    if (!ref.current) return
    ref.current.getHtmlIframe()?.contentWindow?.postMessage({ id, data }, "*")
  }

  const softUpdateParams = (params: FxParamsData) => {
    runtime.state.update({ params })
    dispatchEvent("fxhash_params:update", { params })
  }

  // state update debounce - uses a ref to ensure debounce is proper
  const stateUpdateRef = useRef(runtime.state.update)
  stateUpdateRef.current = runtime.state.update
  const updtParamsDeb = useCallback(
    debounce((params) => stateUpdateRef.current?.(params), 200),
    []
  )

  // generic update, used to manipulated the control state, eventually soft
  // refresh the "sync" parameters
  // forceRefresh will circumvent any sync param rule and force a refresh of the
  // runtime state
  const updateParams = (
    update: Partial<FxParamsData>,
    forceRefresh: boolean = false
  ) => {
    if (!forceRefresh) {
      // find the params which have changed and are "synced"
      const changed = Object.keys(update)
        .filter((id) => controls.params.values[id] !== update[id])
        .map((id) => controls.params.definition?.find((d) => d.id === id)!)
      // params that are "synced"
      const synced = changed.filter((def) => def.update === "sync")
      // if at least a change, soft refresh
      if (Object.keys(synced).length > 0) {
        softUpdateParams(
          Object.fromEntries(synced.map((def) => [def.id, update[def.id]]))
        )
      }
      // if auto-refresh is defined, we update params on the runtime (will only)
      // reload the hard params
      if (options.autoRefresh) {
        updtParamsDeb({
          params: update,
        })
      }
    } else {
      runtime.state.update({ params: update })
    }
    // in any case, refresh the control state
    setControls(
      merge(cloneDeep(controls), {
        params: {
          values: update,
        },
      })
    )
  }

  // derive active URL that should be loaded in the iframe
  const url = useMemo(() => {
    return ipfsUrlWithHashAndParams(
      project.cid,
      runtime.state.hash,
      runtime.state.minter,
      runtime.details.params.inputBytes || project.inputBytes
    )
  }, [project.cid, runtime.details.stateHash.hard])

  // stores the last url set for the iframe
  const lastUrl = useRef("")

  // every time the URL changes, refresh the iframe
  useEffect(() => {
    const iframe = ref.current?.getHtmlIframe()
    if (iframe && lastUrl.current !== url) {
      iframe.contentWindow?.location.replace(url)
      lastUrl.current = url
    }
  }, [url])

  const refresh = useCallback(() => {
    ref.current
      ?.getHtmlIframe()
      ?.contentWindow?.location.replace(lastUrl.current)
  }, [])

  const hardSync = () => {
    runtime.update({
      state: {
        params: controls.params.values,
      },
    })
    refresh()
  }

  const controlDetails = useMemo<IControlDetails>(
    () => ({
      params: {
        inputBytes: serializeParamsOrNull(
          controls.params.values,
          controls.params.definition || []
        ),
      },
      stateHash: {
        soft: hashRuntimeState({
          hash: runtime.state.hash,
          minter: runtime.state.minter,
          params: controls.params.values,
        }),
        hard: hashRuntimeHardState(
          {
            hash: runtime.state.hash,
            minter: runtime.state.minter,
            params: controls.params.values,
          },
          controls.params.definition
        ),
      },
    }),
    [controls, runtime]
  )

  return {
    runtime,
    controls: {
      state: controls,
      details: controlDetails,
      updateParams,
      dispatchEvent,
      hardSync,
      refresh,
    },
    details: {
      activeUrl: url,
      controlsUrl: useMemo(() => {
        return ipfsUrlWithHashAndParams(
          project.cid,
          runtime.state.hash,
          runtime.state.minter,
          controlDetails.params.inputBytes || project.inputBytes
        )
      }, [project.cid, runtime.details.stateHash.soft, controls.params]),
      runtimeSynced:
        runtime.details.stateHash.hard === controlDetails.stateHash.hard,
    },
  }
}
