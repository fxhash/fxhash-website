import style from "./InfiniteScrollTrigger.module.scss"
import cs from "classnames"
import { PropsWithChildren, useEffect } from "react"
import { useInView } from "react-intersection-observer"


interface Props {
  onTrigger: () => void
}

export function InfiniteScrollTrigger({
  onTrigger,
  children
}: PropsWithChildren<Props>) {
  const { ref, inView, entry } = useInView()

  useEffect(() => {
    if (inView) {
      onTrigger()
    }
  }, [inView])

  return (
    <div className={cs(style.container)}>
      {children}
      <div className={cs(style.trigger)} ref={ref} />
    </div>
  )
}