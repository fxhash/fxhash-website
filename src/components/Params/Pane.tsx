import { useMemo, useRef } from "react"
import { usePaneOfParams } from "../../context/Params"
import classes from "./Pane.module.scss"

interface IPaneProps {
  params?: string[]
}
export function Pane(props: IPaneProps) {
  const params = useMemo(() => props.params, [JSON.stringify(props.params)])
  const pane = useRef<HTMLDivElement>(null)
  const data = usePaneOfParams(params, pane)
  return <div ref={pane} className={classes.pane} />
}
