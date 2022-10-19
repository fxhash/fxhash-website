import React, {
  PropsWithChildren,
  useState,
  useCallback,
  useRef,
  useEffect,
  useMemo,
} from "react"
import { Pane } from "tweakpane"
interface IParamsContext {
  params: Object
}

const defaultProperties: IParamsContext = {
  params: {},
}

const defaultCtx: IParamsContext = {
  ...defaultProperties,
}

export const ParamsContext = React.createContext<IParamsContext>(defaultCtx)

export function ParamsProvider({ children }: PropsWithChildren<{}>) {
  const [params, setParams] = useState({})
  const [data, setData] = useState({ ...params })
  const ref = useRef()

  const addData = useCallback(
    (entry) => {
      setData({
        ...data,
        ...entry,
      })
    },
    [data, setData]
  )

  useEffect(() => {
    if (!ref.current) return
    const p = new Pane({ container: ref.current })
    Object.keys(params).map((key) => {
      p.addInput(params, key)
    })
    p.on("change", (e) => {
      addData({ [e.presetKey]: e.value })
    })
    return () => {
      p.dispose()
    }
  }, [params, ref, addData])
  return (
    <ParamsContext.Provider value={{ setParams, ...data }}>
      <div ref={ref} />
      {children}
    </ParamsContext.Provider>
  )
}
