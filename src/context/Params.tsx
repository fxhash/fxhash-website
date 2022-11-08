import React, {
  PropsWithChildren,
  useState,
  useRef,
  useEffect,
  useCallback,
  useContext,
  RefObject,
  MutableRefObject,
  useMemo,
} from "react"
import { Pane, InputParams, TpChangeEvent } from "tweakpane"

export type ParamsSchema = Record<string, unknown>

interface IParamsContext<CustomParams = ParamsSchema> {
  pane?: Pane | undefined
  params?: CustomParams | undefined
  data?: CustomParams | undefined
  values?: MutableRefObject<CustomParams> | undefined
  addParams: (params: CustomParams) => void
  setParam: (key: string, value: any) => void
  setPaneContainer: (container?: HTMLDivElement) => void
}

interface IPaneConfiguration<CustomParams = ParamsSchema> {
  name?: string
  params?: CustomParams
}

const defaultProperties: IParamsContext = {
  addParams: () => {},
  setParam: () => {},
  setPaneContainer: () => {},
}

const defaultCtx: IParamsContext = {
  ...defaultProperties,
}

export const ParamsContext = React.createContext<IParamsContext>(defaultCtx)

export function useParams(
  parameters: ParamsSchema,
  paneContainerRef: RefObject<HTMLDivElement>
) {
  const params = useContext(ParamsContext)
  useEffect(() => {
    params.addParams(parameters)
    if (paneContainerRef?.current)
      params.setPaneContainer(paneContainerRef?.current)
  }, [parameters, paneContainerRef])
  return params
}

const filterParams = (
  params: ParamsSchema | undefined,
  filter: (parameter: unknown, key: string) => boolean
) => {
  if (!params) return
  const paramsCopy = JSON.parse(JSON.stringify(params))
  return Object.keys(paramsCopy).reduce((acc: ParamsSchema, key: string) => {
    if (filter(paramsCopy[key], key)) {
      acc[key] = paramsCopy[key]
    }
    return acc
  }, {})
}

interface PaneSettings {
  container: HTMLElement | null
}

function usePaneStable(
  params: ParamsSchema | undefined,
  settings: PaneSettings
) {
  const values = useRef<ParamsSchema>({})
  const pane = useRef<Pane>()
  const {
    setParam,
    pane: contextPane,
    values: contextValues,
  } = useContext(ParamsContext)
  useEffect(() => {
    if (!settings.container || !params) return
    const p = new Pane({ container: settings.container })
    Object.keys(params).map((key) => {
      p.addInput(params, key)
    })
    p.on("change", (e: TpChangeEvent<unknown>) => {
      setParam(e.presetKey as string, e.value)
    })

    pane.current = p
    values.current = params
    return () => {
      p.dispose()
    }
  }, [params, settings, setParam, contextValues])
  useEffect(() => {
    contextPane?.on?.("change", (e: TpChangeEvent<unknown>) => {
      const key = e.presetKey as string
      const value = e.value
      if (values.current[key] === value) return
      values.current[key] = value
      pane.current?.refresh()
    })
  }, [contextPane, pane, values])
}

export function usePaneOfParams(
  paramsKeys: string[],
  container: RefObject<HTMLElement | null>
) {
  const pContext = useContext(ParamsContext)
  const params = useMemo(
    () => filterParams(pContext.params, (p, key) => paramsKeys.includes(key)),
    [pContext.params, paramsKeys]
  )

  const settings = useMemo(() => {
    return {
      container: container.current,
    }
  }, [container.current])
  const data = usePaneStable(params, settings)
  return pContext.data
}

export function ParamsProvider({ children }: PropsWithChildren<{}>) {
  const paneContainerRef = useRef<HTMLDivElement>(null)
  const values = useRef<ParamsSchema>({})
  const [pane, setPane] = useState<Pane>()
  const [paneContainer, setPaneContainer] = useState<HTMLElement>()
  const [params, setParams] = useState<ParamsSchema>({})
  const [data, setData] = useState({})

  const addParams = useCallback(
    (params: ParamsSchema) => {
      setParams((p) => ({ ...p, ...params }))
      setData((d) => ({ ...d, ...params }))
    },
    [setParams, setData]
  )

  const setParam = useCallback(
    (key: string, value: any) => {
      if (!values.current) return
      if (values?.current?.[key] === value) return
      values.current[key] = value
      pane?.refresh()
    },
    [pane, values]
  )

  useEffect(() => {
    const container = paneContainer || paneContainerRef?.current
    if (!container) return
    const p = new Pane({ container })
    Object.keys(params).map((key) => {
      p.addInput(params, key)
    })
    p.on("change", (e: TpChangeEvent<unknown>) => {
      setData((d) => ({ ...d, [e.presetKey as string]: e.value }))
    })
    setPane(p)
    values.current = params
    return () => {
      p.dispose()
    }
  }, [params, paneContainer])

  const contextValue = useMemo(
    () => ({
      addParams,
      setParam,
      setPaneContainer,
      data,
      params,
      pane,
      setData,
      values,
    }),
    [addParams, setPaneContainer, data, pane, setData, values, params, setParam]
  )

  return (
    <ParamsContext.Provider value={contextValue}>
      <div ref={paneContainerRef} style={{ display: "none" }} />
      {children}
    </ParamsContext.Provider>
  )
}
