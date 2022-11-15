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
  IParameterDefinition,
  ParameterDefinitions,
  ParameterValueMap,
} from "../components/Params/tweakpane"
import {
  createParameterDictFromList,
  filterParameterDefinitioDict,
} from "../components/Params/tweakpane/utils"

interface IParamsContext<CustomParams = ParameterValueMap> {
  pane?: Pane | undefined
  params?: ParameterDefinitions | undefined
  data?: CustomParams | undefined
  values?: MutableRefObject<CustomParams> | undefined
  registerParams: (params: IParameterDefinition[]) => void
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
  parameters: IParameterDefinition[],
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
  params: ParameterDefinitions | undefined,
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
    const [p, pValues] = createFxPane(settings.container, params)
    p.on("change", (e: TpChangeEvent<unknown>) => {
      setParam(e.presetKey as string, e.value)
    })
    pane.current = p
    values.current = pValues
    return () => {
      p.dispose()
    }
  }, [params, settings, setParam, contextValues])
  useEffect(() => {
    contextPane?.on?.("change", (e: TpChangeEvent<unknown>) => {
      const key = e.presetKey as string
      const value = e.value
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
  const params = useMemo<ParameterDefinitions | undefined>(
    () =>
      filterParameterDefinitioDict(pContext.params, (p: IParameterDefinition) =>
        paramsKeys.includes(p.id)
      ),
    [pContext.params, paramsKeys]
  )

  const settings = useMemo(() => {
    return {
      container: container.current,
    }
  }, [container.current])
  usePaneStable(params, settings)
  return pContext.data
}

export function ParamsProvider({ children }: PropsWithChildren<{}>) {
  const paneContainerRef = useRef<HTMLDivElement>(null)
  const values = useRef<ParameterValueMap>({})
  const [pane, setPane] = useState<Pane>()
  const [paneContainer, setPaneContainer] = useState<HTMLElement>()
  const [params, setParams] = useState<ParameterDefinitions>({})
  const [data, setData] = useState({})

  const registerParams = useCallback(
    (params: IParameterDefinition[]) => {
      setParams((p) => ({ ...p, ...createParameterDictFromList(params) }))
      // setData((d) => ({ ...d, ...params }))
    },
    [setParams]
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
    const [p, pValues] = createFxPane(container, params)
    p.on("change", (e: TpChangeEvent<unknown>) => {
      setData((d) => ({ ...d, [e.presetKey as string]: e.value }))
    })
    setPane(p)
    values.current = pValues
    return () => {
      p.dispose()
    }
  }, [params, paneContainer])

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
