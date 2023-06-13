import { PropsWithChildren } from "react"
import { createContext } from "react"
import { IRuntimeContext, useRuntime } from "hooks/useRuntime"

/**
 * The Runtime Context is responsible for managing the state of a project ran
 * in a frame. It centralizes any source of data to derive the project and
 * facilitate their manipulation from the outside.
 *
 * See comments on IRuntimeContext for more details.
 */

const defaultRuntimeContext: IRuntimeContext = {
  state: {
    hash: "",
    minter: "",
    params: {},
    update: () => {},
  },
  definition: {
    params: null,
    version: null,
    features: null,
    update: () => {},
  },
  update: () => {},
  details: {
    definitionHash: {
      params: "",
    },
    stateHash: {
      soft: "",
      hard: "",
    },
    params: {
      inputBytes: null,
      bytesSize: 0,
    },
  },
}

export const RuntimeContext = createContext(defaultRuntimeContext)

type Props = PropsWithChildren<any>
export function RuntimeProvider({ children }: Props) {
  const runtime = useRuntime()
  return (
    <RuntimeContext.Provider value={runtime}>
      {children}
    </RuntimeContext.Provider>
  )
}
