import React, {
  PropsWithChildren,
  useState,
  useCallback,
  useRef,
  useEffect,
  useMemo,
} from "react"
import { Pane, InputParams, TpChangeEvent } from "tweakpane"

interface IParamsContext {
  addParams: (params: InputParams) => void
}

const defaultProperties: IParamsContext = {
  addParams: () => {},
}

const defaultCtx: IParamsContext = {
  ...defaultProperties,
}

export const ParamsContext = React.createContext<IParamsContext>(defaultCtx)

export function ParamsProvider({ children }: PropsWithChildren<{}>) {
  const [params, setParams] = useState<InputParams>({})
  const [data, setData] = useState({})

  const addParams = (params: InputParams) => {
    setParams((p) => ({ ...p, ...params }))
    setData((d) => ({ ...d, ...params }))
  }

  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ref.current) return
    const p = new Pane({ container: ref.current })
    Object.keys(params).map((key) => {
      p.addInput(params, key)
    })
    p.on("change", (e: TpChangeEvent<unknown>) => {
      setData((d) => ({ ...d, [e.presetKey as string]: e.value }))
    })
    return () => {
      p.dispose()
    }
  }, [params, ref])

  return (
    <ParamsContext.Provider value={{ addParams, ...data }}>
      <div ref={ref} />
      {children}
    </ParamsContext.Provider>
  )
}
