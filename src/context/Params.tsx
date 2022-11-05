import React, {
  PropsWithChildren,
  useState,
  useRef,
  useEffect,
  useCallback,
  useContext,
  Ref,
  RefObject,
  MutableRefObject,
  useMemo,
} from "react"
import { Pane, InputParams, TpChangeEvent } from "tweakpane"

type ParamsShema = Record<string, unknown>

interface IParamsContext<CustomParams = ParamsShema> {
  pane?: MutableRefObject<Pane | undefined>
  params?: CustomParams
  addParams: (params: CustomParams) => void
  setParam: (key: string, value: any) => void
  setPaneContainer: (container?: HTMLDivElement) => void
}

interface IPaneConfiguration<CustomParams = ParamsShema> {
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
  parameters: ParamsShema,
  paneContainerRef: RefObject<HTMLDivElement>
) {
  const params = useContext(ParamsContext)
  useEffect(() => {
    params.addParams(parameters)
    params.setPaneContainer(paneContainerRef?.current)
  }, [parameters, paneContainerRef])
  return params
}

const filterParams = (params, filter) => {
  if (!params) return
  const paramsCopy = JSON.parse(JSON.stringify(params))
  return Object.keys(paramsCopy).reduce((acc, key) => {
    if (filter(paramsCopy[key], key)) {
      acc[key] = paramsCopy[key]
    }
    return acc
  }, {})
}

function usePaneStable(params, settings) {
  const values = useRef()
  const pane = useRef()
  const [data, setData] = useState({})
  const pContext = useContext(ParamsContext)
  useEffect(() => {
    if (!settings.container || !params) return
    values.current = JSON.parse(JSON.stringify(params))
    const p = new Pane({ container: settings.container })
    Object.keys(values.current).map((key) => {
      p.addInput(values.current, key)
    })
    p.on("change", (e: TpChangeEvent<unknown>) => {
      setData((d) => ({ ...d, [e.presetKey as string]: e.value }))
      pContext.setParam(e.presetKey, e.value)
      console.log("trigger change?")
    })

    console.log("stable")
    pane.current = p
    return () => {
      p.dispose()
    }
  }, [params, settings, pContext.setParam])
  useEffect(() => {
    pContext?.pane?.on("change", (e: TpChangeEvent<unknown>) => {
      const key = e.presetKey
      const value = e.value
      setData((d) => ({ ...d, [key]: value }))
      values.current[key] = value
      pane.current?.refresh()
    })
  }, [pContext.pane, pane])
  return data
}

export function usePaneOfParams(paramsKeys, container) {
  const pContext = useContext(ParamsContext)
  const params = useMemo(
    () => filterParams(pContext.params, (p, key) => paramsKeys.includes(key)),
    [pContext.params, paramsKeys]
  )
  const settings = useMemo(
    () => ({
      container: container.current,
    }),
    [container.current]
  )
  const data = usePaneStable(params, settings)
  console.log(data)
  return data
}

export function ParamsProvider({ children }: PropsWithChildren<{}>) {
  //  const pane = useRef<Pane>()
  const values = useRef()
  const [pane, setPane] = useState()
  const [paneContainer, setPaneContainer] = useState<HTMLDivElement>()
  const [params, setParams] = useState<ParamsShema>({})
  const [data, setData] = useState({})

  const addParams = (params: ParamsShema) => {
    setParams((p) => ({ ...p, ...params }))
    setData((d) => ({ ...d, ...params }))
  }

  const setParam = useCallback(
    (key: string, value: any) => {
      // setParams((d) => ({ ...d, [key]: value }))
      setData((d) => ({ ...d, [key]: value }))
      values.current[key] = value
      pane?.refresh()
    },
    [pane]
  )

  useEffect(() => {
    values.current = JSON.parse(JSON.stringify(params))
    const p = new Pane({ container: paneContainer })
    Object.keys(values.current).map((key) => {
      p.addInput(values.current, key)
    })
    p.on("change", (e: TpChangeEvent<unknown>) => {
      setData((d) => ({ ...d, [e.presetKey as string]: e.value }))
    })
    // p.refresh()
    setPane(p)
    console.log("CREATED MAIN PANE")
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
      values: values.current,
    }),
    [
      addParams,
      setParams,
      setPaneContainer,
      data,
      pane,
      setData,
      values,
      params,
    ]
  )

  return (
    <ParamsContext.Provider value={contextValue}>
      {children}
    </ParamsContext.Provider>
  )
}
