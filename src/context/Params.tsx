import React, {
  PropsWithChildren,
  useState,
  useRef,
  useEffect,
  useContext
} from "react"
import { Pane, InputParams, TpChangeEvent } from "tweakpane"

interface IParamsContext {
  addParams: (params: InputParams) => void
  setParam: (key: string, value: any) => void
}

const defaultProperties: IParamsContext = {
  addParams: () => {},
  setParam: () => {},
}

const defaultCtx: IParamsContext = {
  ...defaultProperties,
}

export const ParamsContext = React.createContext<IParamsContext>(defaultCtx)

export function useParams(parameters: InputParams) {
  const params = useContext(ParamsContext)
  useEffect(() => {
    params.addParams(parameters)
  }, [parameters])
  return params
}

export function ParamsProvider({ children }: PropsWithChildren<{}>) {
  const pane = useRef<Pane>()
  const [params, setParams] = useState<InputParams>({})
  const [data, setData] = useState({})

  const addParams = (params: InputParams) => {
    setParams((p) => ({ ...p, ...params }))
    setData((d) => ({ ...d, ...params }))
  }

  const setParam = (key: string, value: any) => {
    setParams((d) => ({ ...d, [key]: value }))
    setData((d) => ({ ...d, [key]: value }))
  }

  useEffect(() => {
    const p = new Pane()
    pane.current = p
    Object.keys(params).map((key) => {
      p.addInput(params, key)
    })
    p.on("change", (e: TpChangeEvent<unknown>) => {
      setData((d) => ({ ...d, [e.presetKey as string]: e.value }))
    })
    p.refresh()
    return () => {
      p.dispose()
    }
  }, [params])

  return (
    <ParamsContext.Provider value={{ addParams, setParam, ...data }}>
      {children}
    </ParamsContext.Provider>
  )
}
