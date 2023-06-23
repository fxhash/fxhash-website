import style from "./ProgressAnimated.module.scss"
import cs from "classnames"
import { forwardRef, useImperativeHandle, useRef } from "react"

export interface ProgressAnimatedRef {
  start: () => void
}
interface Props {
  width?: string
  duration?: number
  className?: string
}
export const ProgressAnimated = forwardRef<ProgressAnimatedRef, Props>(
  ({ className, width, duration = 2 }, ref) => {
    const divRef = useRef<HTMLDivElement>(null)

    const start = () => {
      divRef.current?.classList.remove(style.loading)
      setTimeout(() => {
        divRef.current?.classList.add(style.loading)
      }, 10)
    }
    useImperativeHandle(ref, () => ({
      start,
    }))

    return (
      <div
        ref={divRef}
        className={cs(style.container, className)}
        style={{
          width,
        }}
      >
        <div />
      </div>
    )
  }
)
ProgressAnimated.displayName = "ProgressAnimated"
