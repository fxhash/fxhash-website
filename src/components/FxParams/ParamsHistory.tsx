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
import { stringifyParamsData } from "./utils"

const isEqual = (a: any, b: any) =>
  stringifyParamsData(a) === stringifyParamsData(b)

type ParamsHistoryActionType = "params-update" | "hash-update"

export interface IParamsHistoryEntry {
  type: ParamsHistoryActionType
  oldValue: any
  newValue: any
}

type ParamsHistoryAction = (entry: IParamsHistoryEntry) => void

export type ParamConfiguration = {
  hash: string
  inputBytes: string
  name: string
  createdAt: number
}

export const concatParamConfiguration = (c: ParamConfiguration) =>
  `${c.hash}-${c.inputBytes}`

type StoredConfigurations = Record<string, ParamConfiguration[]>

export interface IParamsHistoryContext {
  storedConfigurations: StoredConfigurations
  registerAction: (t: ParamsHistoryActionType, a: ParamsHistoryAction) => void
  history: IParamsHistoryEntry[]
  pushHistory: (entry: IParamsHistoryEntry) => void
  offset: number
  setOffset: (o: number) => void
  undo: () => void
  redo: () => void
  saveConfiguration: (id: string, config: ParamConfiguration) => void
  updateConfigName: (id: string, idx: number, name: string) => void
  removeConfig: (id: string, idx: number) => void
}

const defaultParamsHistoryContext: IParamsHistoryContext = {
  registerAction: () => {},
  history: [],
  pushHistory: () => {},
  offset: 0,
  setOffset: () => {},
  undo: () => {},
  redo: () => {},
  storedConfigurations: {},
  saveConfiguration: () => {},
  updateConfigName: () => {},
  removeConfig: () => {},
}

export const ParamsHistoryContext = createContext(defaultParamsHistoryContext)

type ParamHistoryActions = Record<
  ParamsHistoryActionType,
  ParamsHistoryAction | undefined
>

type Props = PropsWithChildren<{}>

export function ParamsHistoryProvider({ children }: Props) {
  const [storedConfigurations, setStoredConfigurations] =
    useState<StoredConfigurations>({})
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

  const saveConfiguration = (id: string, config: ParamConfiguration) => {
    const configurations = {
      ...storedConfigurations,
      [id]: [config, ...(storedConfigurations[id] || [])],
    }
    setStoredConfigurations(configurations)
    localStorage.setItem("storedConfigurations", JSON.stringify(configurations))
  }

  const updateConfigName = (id: string, idx: number, name: string) => {
    const updatedConfigurations = storedConfigurations[id]
    storedConfigurations[id][idx].name = name
    const configurations = {
      ...storedConfigurations,
      [id]: updatedConfigurations,
    }
    setStoredConfigurations(configurations)
    localStorage.setItem("storedConfigurations", JSON.stringify(configurations))
  }

  const removeConfig = (id: string, idx: number) => {
    const updatedConfigurations = storedConfigurations[id].filter(
      (_, i) => i !== idx
    )
    const configurations = {
      ...storedConfigurations,
      [id]: updatedConfigurations,
    }
    setStoredConfigurations(configurations)
    localStorage.setItem("storedConfigurations", JSON.stringify(configurations))
  }

  useEffect(() => {
    const fromStorage = localStorage.getItem("storedConfigurations")
    const stored = fromStorage ? JSON.parse(fromStorage) : {}
    setStoredConfigurations(stored)
  }, [])

  const context: IParamsHistoryContext = {
    registerAction,
    history,
    pushHistory: pushHistoryDebounced,
    offset,
    setOffset,
    undo,
    redo,
    storedConfigurations,
    saveConfiguration,
    updateConfigName,
    removeConfig,
  }

  return (
    <ParamsHistoryContext.Provider value={context}>
      {children}
    </ParamsHistoryContext.Provider>
  )
}
