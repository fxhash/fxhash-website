import {
  FxParamDefinition,
  FxParamType,
  FxParamsData,
} from "components/FxParams/types"
import { useMemo, useState } from "react"
import sha1 from "sha1"
import {
  jsonStringifyBigint,
  serializeParamsOrNull,
  sumBytesParams,
} from "components/FxParams/utils"
import { TUpdateStateFn, TUpdateableState } from "types/utils/state"
import { RawTokenFeatures } from "types/Metadata"
import { merge, cloneDeep } from "lodash"

/**
 * The Runtime Context is responsible for managing the state of a project ran
 * in a frame. It centralizes any source of data to derive the project and
 * facilitate their manipulation from the outside.
 *
 * See comments on IRuntimeContext for more details.
 */

export interface RuntimeState {
  hash: string
  minter: string
  iteration: number
  params: FxParamsData
}

export interface RuntimeDefinition {
  params: FxParamDefinition<FxParamType>[] | null
  version: string | null
  features: RawTokenFeatures | null
}

export interface RuntimeWholeState {
  state: RuntimeState
  definition: RuntimeDefinition
}

/**
 * Hashes a runtime state using sha1
 */
export function hashRuntimeState(state: RuntimeState) {
  return sha1(jsonStringifyBigint(state))
}

/**
 * Hashes the hard-refresh properties of a runtime state:
 * - hash
 * - minter address
 * - params in update mode "page-reload"
 */
export function hashRuntimeHardState(
  state: RuntimeState,
  definition: FxParamDefinition<FxParamType>[] | null
) {
  const staticParams: FxParamsData = {}
  for (const id in state.params) {
    const def = definition?.find((def) => def.id === id)
    // if no definition, or update == "page-reload" (which is default value)
    if (!def || !def.update || def.update === "page-reload") {
      staticParams[id] = state.params[id]
    }
  }
  return hashRuntimeState({
    ...state,
    params: staticParams,
  })
}

export interface IRuntimeContext {
  // the base state of the runtime
  state: TUpdateableState<RuntimeState>
  // definitions, used to manipulate the state
  definition: TUpdateableState<RuntimeDefinition>
  // whoe-state update function, should be used to prevent side-effects
  update: TUpdateStateFn<RuntimeWholeState>
  // extra details derived from the state & definition
  details: {
    params: {
      inputBytes: string | null
      bytesSize: number
    }
    stateHash: {
      soft: string
      hard: string
    }
    definitionHash: {
      params: string
    }
  }
}

type Parameters = {
  state?: Partial<RuntimeState>
}
export function useRuntime(initial?: Parameters): IRuntimeContext {
  const [whole, setWhole] = useState<RuntimeWholeState>({
    state: {
      hash: "",
      minter: "",
      iteration: 1,
      params: {},
      ...initial?.state,
    },
    definition: {
      params: null,
      version: null,
      features: null,
    },
  })

  const { state, definition } = whole

  const updateState: TUpdateStateFn<RuntimeState> = (state) => {
    setWhole((existingState) => merge(cloneDeep(existingState), { state }))
  }

  const updateDefinition: TUpdateStateFn<RuntimeDefinition> = (definition) => {
    setWhole((existingState) => merge(cloneDeep(existingState), { definition }))
  }

  const update: TUpdateStateFn<RuntimeWholeState> = (data) => {
    setWhole((existingState) => merge(cloneDeep(existingState), data))
  }

  // enhance each param definition with the version (useful for serialization)
  const definitionEnhanced = useMemo(
    () => ({
      ...definition,
      params:
        definition.params?.map((p: FxParamDefinition<FxParamType>) => ({
          ...p,
          version: definition.version || "0",
        })) || null,
    }),
    [definition]
  )

  return {
    state: {
      ...state,
      update: updateState,
    },
    definition: {
      ...definitionEnhanced,
      update: updateDefinition,
    },
    update: update,
    details: useMemo(
      () => ({
        params: {
          inputBytes: serializeParamsOrNull(
            state.params,
            definitionEnhanced.params || []
          ),
          bytesSize: sumBytesParams(definitionEnhanced.params || []),
        },
        stateHash: {
          soft: hashRuntimeState(state),
          hard: hashRuntimeHardState(state, definitionEnhanced.params),
        },
        definitionHash: {
          params: sha1(jsonStringifyBigint(definitionEnhanced.params)),
        },
      }),
      [state, definitionEnhanced.params]
    ),
  }
}
