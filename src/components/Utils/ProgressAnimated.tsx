import style from "./ProgressAnimated.module.scss"
import cs from "classnames"
import { forwardRef, useImperativeHandle, useRef } from "react"

export interface ProgressAnimatedRef {
  start: () => void
}
interface Props {
  width: string
  duration?: number
}
export const ProgressAnimated = forwardRef<ProgressAnimatedRef, Props>(({
  width,
  duration = 2
}, ref) => {
  const divRef = useRef<HTMLDivElement>(null)

  const start = () => {
    divRef.current?.classList.remove(style.loading)
    setTimeout(() => {
      divRef.current?.classList.add(style.loading)
    }, 10)
  }
  useImperativeHandle(ref, () => ({
    start
  }))

  return (
    <div
      ref={divRef}
      className={cs(style.container)}
      style={{
        width
      }}
    >
      <div/>
    </div>
  )
})
ProgressAnimated.displayName = 'ProgressAnimated'
