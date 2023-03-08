import {
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef,
} from "react"
import { createContext } from "react"
import debounce from "lodash.debounce"
import { strinigfyParams } from "./utils"

const isEqual = (a: any, b: any) => strinigfyParams(a) === strinigfyParams(b)

type ParamsHistoryActionType = "params-update" | "hash-update"

export interface IParamsHistoryEntry {
  type: ParamsHistoryActionType
  oldValue: any
  newValue: any
}

type ParamsHistoryAction = (entry: IParamsHistoryEntry) => void

export interface IParamsHistoryContext {
  registerAction: (t: ParamsHistoryActionType, a: ParamsHistoryAction) => void
  history: IParamsHistoryEntry[]
  pushHistory: (entry: IParamsHistoryEntry) => void
  offset: number
  setOffset: (o: number) => void
  undo: () => void
  redo: () => void
}

const defaultParamsHistoryContext: IParamsHistoryContext = {
  registerAction: () => {},
  history: [],
  pushHistory: () => {},
  offset: 0,
  setOffset: () => {},
  undo: () => {},
  redo: () => {},
}

export const ParamsHistoryContext = createContext(defaultParamsHistoryContext)

type ParamHistoryActions = Record<
  ParamsHistoryActionType,
  ParamsHistoryAction | undefined
>

type Props = PropsWithChildren<{}>

export function ParamsHistoryProvider({ children }: Props) {
  const [history, setHistory] = useState<IParamsHistoryEntry[]>([])
  const [offset, setOffset] = useState<number>(-1)
  const actions = useRef<Partial<ParamHistoryActions>>()

  const pushHistory = (entry: IParamsHistoryEntry) => {
    setHistory((prev) => [entry, ...prev])

    const historyEntry = history[0]
    const lastStatesPerActionType = Object.keys(actions?.current || {})
      .filter((actionType) => actionType !== entry.type)
      .map((actionType) => {
        return history.find((historyEntry) => historyEntry.type === actionType)
      })
    lastStatesPerActionType.forEach((historyEntry) => {
      if (!historyEntry) return
      actions?.current?.[historyEntry?.type]?.(historyEntry?.newValue)
    })
    setOffset(-1)
  }

  const pushHistoryDebounced = useCallback(debounce(pushHistory, 200), [
    history,
    setHistory,
    setOffset,
  ])

  const undo = () => {
    if (offset >= history.length) return
    const nextOffset = offset + 1
    setOffset(nextOffset)
    const historyEntry = history[nextOffset]
    actions?.current?.[historyEntry.type]?.(historyEntry.oldValue)
  }

  const redo = () => {
    if (offset <= -1) return
    const historyEntry = history[offset]
    actions?.current?.[historyEntry.type]?.(historyEntry.newValue)
    const prevOffset = offset - 1
    setOffset(prevOffset)
  }

  const registerAction = (
    actionType: ParamsHistoryActionType,
    action: ParamsHistoryAction
  ) => {
    actions.current = {
      ...actions?.current,
      [actionType]: action,
    }
  }

  const context: IParamsHistoryContext = {
    registerAction,
    history,
    pushHistory: pushHistoryDebounced,
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
