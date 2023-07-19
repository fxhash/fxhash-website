import { merge, cloneDeep, debounce } from "lodash"
import {
  useEffect,
  useState,
  useCallback,
  useMemo,
  useRef,
  RefObject,
} from "react"
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
  TExecutionContext,
  hashRuntimeHardState,
  hashRuntimeState,
  useRuntime,
} from "./useRuntime"
import {
  buildParamsObject,
  serializeParams,
  serializeParamsOrNull,
  fxParamsAsQueryParams,
} from "components/FxParams/utils"
import { ipfsUrlWithHashAndParams } from "utils/ipfs"
import { DeepPartial } from "types/DeepPartial"
import { useRouter } from "next/router"
import { useMessageListener } from "./useMessageListener"
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
  iteration?: number
  minter?: string
  inputBytes?: string
  context?: TExecutionContext
  snippetVersion: string
}

export type TRuntimeContextConnector = (
  ref: RefObject<ArtworkIframeRef | null>
) => {
  getUrl: (state: IProjectState, urlParams?: URLSearchParams) => string
  useSync: (runtimeUrl: string, controlsUrl: string) => void
}

const iframeHandler: TRuntimeContextConnector = (iframeRef) => {
  let lastUrl = ""

  return {
    getUrl(state: IProjectState, urlParams?: URLSearchParams) {
      const searchParams = urlParams?.toString()
      return (
        ipfsUrlWithHashAndParams(state.cid, {
          fxhash: state.hash || "",
          fxiteration: state.iteration || 1,
          fxminter: state.minter || "",
          fxparams: state.inputBytes,
          fxcontext: state.context,
          fxParamsAsQueryParams: fxParamsAsQueryParams(state.snippetVersion),
        }) + (searchParams ? `?${searchParams}` : "")
      )
    },
    useSync(runtimeUrl: string, controlsUrl: string) {
      // every time the runtime URL changes, refresh the iframe
      useEffect(() => {
        const iframe = iframeRef.current?.getHtmlIframe()
        if (iframe && lastUrl !== runtimeUrl) {
          iframe.contentWindow?.location.replace(runtimeUrl)
          lastUrl = runtimeUrl
        }
      }, [runtimeUrl])
    },
  }
}

interface IRuntimeOptions {
  autoRefresh: boolean
  contextConnector: TRuntimeContextConnector
  urlParams?: URLSearchParams
}

const defaultRuntimeOptions: IRuntimeOptions = {
  autoRefresh: false,
  contextConnector: iframeHandler,
}

type TUseRuntimeController = (
  ref: React.RefObject<ArtworkIframeRef | null>,
  project: IProjectState,
  options?: Partial<IRuntimeOptions>
) => IRuntimeControllerOutput

export const useRuntimeController: TUseRuntimeController = (
  ref,
  project,
  opts
) => {
  const router = useRouter()

  // options
  const options = { ...defaultRuntimeOptions, ...opts }

  // the runtime state -> controls the state connected to the iframe
  const runtime = useRuntime({
    state: {
      hash: project.hash || generateFxHash(),
      minter: project.minter || generateTzAddress(),
      iteration: project.iteration || 1,
      context: project.context,
    },
    definition: {
      version: project.snippetVersion,
    },
  })

  useEffect(() => {
    if (!project.minter) return
    if (runtime.state.minter !== project.minter)
      runtime.state.update({
        minter: project.minter || generateTzAddress(),
      })
  }, [project.minter, runtime.state.minter])

  // the control state -> used to control the iframe
  const [controls, setControls] = useState<IControlState>({
    params: {
      definition: null,
      values: {},
    },
  })

  // a connector is usedd to interact with the iframe - can be usefull for edge
  // cases such as with the sandbox
  const connector = useMemo(
    () => options.contextConnector(ref),
    [options.contextConnector, ref]
  )

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

  const updateQueryParams = ({
    fxhash,
    fxparams,
  }: {
    fxhash: string
    fxparams: string
  }) =>
    router.replace(
      {
        query: {
          ...router.query,
          fxhash,
        },
        hash: `0x${fxparams}`,
      },
      undefined,
      { shallow: true }
    )

  // whenever the runtime state changes, update the query params
  useEffect(() => {
    updateQueryParams({
      fxhash: runtime.state.hash,
      fxparams: runtime.details.params.inputBytes || project.inputBytes || "",
    })
  }, [runtime.state.hash, runtime.details.params.inputBytes])

  const dispatchEvent = (id: string, data: any) => {
    if (!ref.current) return
    ref.current.getHtmlIframe()?.contentWindow?.postMessage({ id, data }, "*")
  }

  // state update debounce - uses a ref to ensure debounce is proper
  const stateUpdateRef = useRef(runtime.state.update)
  stateUpdateRef.current = runtime.state.update
  const updtParamsDeb = useCallback(
    debounce((params) => stateUpdateRef.current?.(params), 200),
    []
  )

  const softUpdateParams = (params: FxParamsData) => {
    updtParamsDeb({ params })
    dispatchEvent("fxhash_params:update", { params })
  }

  // generic update, used to manipulated the control state, eventually soft
  // refresh the "sync" parameters
  // forceRefresh will circumvent any sync param rule and force a refresh of the
  // runtime state
  const updateParams = (
    update: Partial<FxParamsData>,
    forceRefresh: boolean = false
  ) => {
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
    if (!forceRefresh) {
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
    return connector.getUrl(
      {
        cid: project.cid,
        hash: runtime.state.hash,
        minter: runtime.state.minter,
        iteration: runtime.state.iteration,
        inputBytes: runtime.details.params.inputBytes || project.inputBytes,
        context: runtime.state.context,
        snippetVersion: runtime.definition.version || "",
      },
      options?.urlParams
    )
  }, [project.cid, runtime.details.stateHash.hard, options.urlParams])

  useMessageListener("fxhash_emit:params:update", (e: any) => {
    const { params } = e.data.data
    updateParams(params)
    updtParamsDeb({ params })
  })

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
          iteration: runtime.state.iteration,
          minter: runtime.state.minter,
          params: controls.params.values,
          context: runtime.state.context,
        }),
        hard: hashRuntimeHardState(
          {
            hash: runtime.state.hash,
            iteration: runtime.state.iteration,
            minter: runtime.state.minter,
            params: controls.params.values,
            context: runtime.state.context,
          },
          controls.params.definition
        ),
      },
    }),
    [controls, runtime]
  )

  const controlsUrl = useMemo(() => {
    return connector.getUrl(
      {
        cid: project.cid,
        hash: runtime.state.hash,
        iteration: runtime.state.iteration,
        minter: runtime.state.minter,
        inputBytes: controlDetails.params.inputBytes || project.inputBytes,
        context: runtime.state.context,
        snippetVersion: runtime.definition.version || "",
      },
      options?.urlParams
    )
  }, [project.cid, runtime.details.stateHash.soft, controls.params])

  // every time the URL changes, refresh the iframe
  connector.useSync(url, controlsUrl)

  const refresh = useCallback(() => {
    ref.current?.getHtmlIframe()?.contentWindow?.location.replace(controlsUrl)
  }, [controlsUrl])

  const hardSync = () => {
    runtime.update({
      state: {
        params: controls.params.values,
      },
    })
    refresh()
  }

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
      controlsUrl,
      runtimeSynced:
        runtime.details.stateHash.hard === controlDetails.stateHash.hard,
    },
  }
}
