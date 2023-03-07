import {
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef,
} from "react"
import { createContext } from "react"
import { FxParamsContext } from "./Context"
import debounce from "lodash.debounce"
import { strinigfyParams } from "./utils"

const isEqual = (a: any, b: any) => strinigfyParams(a) === strinigfyParams(b)

type ParamsHistoryActionType = "params-update"

interface IParamsHistoryEntry {
  type: ParamsHistoryActionType
  data: any
}

type ParamsHistoryAction = (entry: IParamsHistoryEntry) => void

export interface IParamsHistoryContext {
  history: IParamsHistoryEntry[]
  pushHistory: (entry: IParamsHistoryEntry) => void
  offset: number
  setOffset: (o: number) => void
  undo: () => void
  redo: () => void
}

const defaultParamsHistoryContext: IParamsHistoryContext = {
  history: [],
  pushHistory: () => {},
  offset: 0,
  setOffset: () => {},
  undo: () => {},
  redo: () => {},
}

export const ParamsHistoryContext = createContext(defaultParamsHistoryContext)

type Props = PropsWithChildren<any>

export function ParamsHistoryProvider({ children }: Props) {
  const lastActionData = useRef(null)
  const { setData, data } = useContext(FxParamsContext)
  const [history, setHistory] = useState<IParamsHistoryEntry[]>([])
  const [offset, setOffset] = useState<number>(0)

  const historyActions: Record<ParamsHistoryActionType, ParamsHistoryAction> = {
    "params-update": (entry: IParamsHistoryEntry) => {
      setData(entry.data)
    },
  }

  const pushHistory = useCallback(
    debounce((entry: IParamsHistoryEntry) => {
      setHistory((prev) => [entry, ...prev])
      setOffset(0)
      lastActionData.current = entry.data
    }, 200),
    []
  )

  const undo = () => {
    if (offset >= history.length) return
    setOffset(offset + 1)
  }

  const redo = () => {
    if (offset <= 0) return
    setOffset(offset - 1)
  }

  // when offset change apply action based on history entry
  useEffect(() => {
    const currentEntry = history?.[offset]
    historyActions[currentEntry?.type as ParamsHistoryActionType]?.(
      currentEntry
    )
    lastActionData.current = currentEntry?.data
  }, [offset])

  // observe data changes and add them to history
  useEffect(() => {
    if (isEqual(data, lastActionData?.current)) return
    if (!data) return
    pushHistory({ type: "params-update", data })
  }, [data, lastActionData.current])

  const context: IParamsHistoryContext = {
    history,
    pushHistory,
    offset,
    setOffset,
    undo,
    redo,
  }

  return (
    <ParamsHistoryContext.Provider value={context}>
      {children}
    </ParamsHistoryContext.Provider>
  )
}
