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
import { Pane, TpChangeEvent } from "tweakpane"
import {
  createFxPane,
  ParameterValueMap,
  consolidateParamValues,
} from "../components/Params/tweakpane"
import { FxParamDefinition } from "../components/Params/types"
interface IParamsContext<CustomParams = ParameterValueMap> {
  pane?: Pane
  params?: FxParamDefinition<any>[]
  data?: CustomParams | undefined
  values?: MutableRefObject<CustomParams> | undefined
  registerParams: (params: FxParamDefinition<any>[]) => void
  setParam: (key: string, value: any) => void
  setPaneContainer: (container?: HTMLDivElement) => void
}

interface IPaneConfiguration<CustomParams = ParameterValueMap> {
  name?: string
  params?: CustomParams
}

const defaultProperties: IParamsContext = {
  registerParams: () => {},
  setParam: () => {},
  setPaneContainer: () => {},
}

const defaultCtx: IParamsContext = {
  ...defaultProperties,
}

export const ParamsContext = React.createContext<IParamsContext>(defaultCtx)

export function useParams(
  parameters: FxParamDefinition<any>[],
  paneContainerRef: RefObject<HTMLDivElement>
) {
  const controller = useContext(ParamsContext)
  const { registerParams, setPaneContainer } = controller
  useEffect(() => {
    registerParams(parameters)
    if (paneContainerRef?.current) setPaneContainer(paneContainerRef?.current)
  }, [parameters, paneContainerRef, setPaneContainer, registerParams])
  return controller
}

interface PaneSettings {
  container: HTMLElement | null
}

function usePaneStable(
  params: FxParamDefinition<any>[] | undefined,
  settings: PaneSettings
) {
  const values = useRef<ParameterValueMap>({})
  const pane = useRef<Pane>()
  const {
    setParam,
    pane: contextPane,
    values: contextValues,
  } = useContext(ParamsContext)
  useEffect(() => {
    if (!settings.container || !params) return
    const [p, pValues] = createFxPane(
      settings.container,
      params,
      pane.current,
      values.current
    )
    p.on("change", (e: TpChangeEvent<unknown>) => {
      setParam(e.presetKey as string, e.value)
    })
    pane.current = p
    values.current = pValues
  }, [params, settings, setParam, contextValues])
  useEffect(() => {
    contextPane?.on?.("change", (e: TpChangeEvent<unknown>) => {
      const key = e.presetKey as string
      const value = e.value
      values.current[key] = value
      pane.current?.refresh()
    })
    return () => {
      pane.current?.dispose()
    }
  }, [contextPane, pane, values])
  return pane
}

export function usePaneOfParams(
  paramsKeys: string[] | undefined,
  container: RefObject<HTMLElement | null>
) {
  const pContext = useContext(ParamsContext)
  const params = useMemo<FxParamDefinition<any>[] | undefined>(
    () =>
      pContext?.params?.filter(
        (p: FxParamDefinition<any>) => !paramsKeys || paramsKeys.includes(p.id)
      ),
    [pContext.params, paramsKeys]
  )

  const settings = useMemo(() => {
    return {
      container: container.current,
    }
  }, [container.current])
  const pane = usePaneStable(params, settings)
  return pane
}

export function ParamsProvider({ children }: PropsWithChildren<{}>) {
  const paneContainerRef = useRef<HTMLDivElement>(null)
  const values = useRef<ParameterValueMap>({})
  const [pane, setPane] = useState<Pane>()
  const [paneContainer, setPaneContainer] = useState<HTMLElement>()
  const [params, setParams] = useState<FxParamDefinition<any>[]>([])
  const [data, setData] = useState<ParameterValueMap>({})

  const registerParams = useCallback(
    (params: FxParamDefinition<any>[]) => {
      setParams(params)
      const valueMap = consolidateParamValues(params, values.current)
      setData(valueMap)
    },
    [setParams, values.current]
  )

  const setParam = useCallback(
    (key: string, value: any) => {
      if (!values.current) return
      values.current[key] = value
      pane?.refresh()
    },
    [pane, values]
  )

  useEffect(() => {
    const container = paneContainer || paneContainerRef?.current
    if (!container) return
    const [p, pValues] = createFxPane(container, params, pane, values.current)
    setPane(p)
    values.current = pValues
  }, [params, paneContainer])

  useEffect(() => {
    if (!pane) return
    pane.on("change", (e: TpChangeEvent<unknown>) => {
      setData((d) => ({ ...d, [e.presetKey as string]: e.value }))
    })
    return () => {
      pane?.dispose()
    }
  }, [pane, setData])

  const contextValue = useMemo(
    () => ({
      registerParams,
      setParam,
      setPaneContainer,
      data,
      params,
      pane,
      setData,
      values,
    }),
    [
      registerParams,
      setPaneContainer,
      data,
      pane,
      setData,
      values,
      params,
      setParam,
    ]
  )

  return (
    <ParamsContext.Provider value={contextValue}>
      <div ref={paneContainerRef} style={{ display: "none" }} />
      {children}
    </ParamsContext.Provider>
  )
}
