import style from "./InfiniteScrollTrigger.module.scss"
import cs from "classnames"
import { PropsWithChildren, useEffect, useRef } from "react"
import { useInView } from "react-intersection-observer"


interface Props {
  canTrigger?: boolean
  onTrigger: () => void
  className?: string
}

export function InfiniteScrollTrigger({
  canTrigger = true,
  onTrigger,
  className,
  children
}: PropsWithChildren<Props>) {
  const { ref, inView, entry } = useInView()

  useEffect(() => {
    if (inView) {
      if (canTrigger) {
        onTrigger()
      }
    }
  }, [inView, canTrigger])

  return (
    <div className={cs(style.container, className)}>
      {children}
      <div className={cs(style.trigger)} ref={ref} />
    </div>
  )
}