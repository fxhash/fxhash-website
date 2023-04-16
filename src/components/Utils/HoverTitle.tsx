import style from "./HoverTitle.module.scss"
import cs from "classnames"
import { PropsWithChildren, useEffect, useMemo, useRef, useState } from "react"

interface Props {
  className?: string
  message?: string | null
}
export function HoverTitle({
  message,
  className,
  children,
}: PropsWithChildren<Props>) {
  const hoverMessageRef = useRef<HTMLDivElement>(null)
  const anchorRef = useRef<HTMLDivElement>(null)
  const [offsetX, setOffetX] = useState<number>(0)

  useEffect(() => {
    function calcScreenOverflow() {
      if (!hoverMessageRef.current || !anchorRef.current) return
      const { left, width: anchorWidth } =
        anchorRef.current.getBoundingClientRect()
      const { width, x } = hoverMessageRef.current.getBoundingClientRect()
      const margin = 8
      if (window.outerWidth > left + width / 2) {
        setOffetX(0)
      } else {
        setOffetX(
          margin + width / 2 - (window.outerWidth - (left + anchorWidth / 2))
        )
      }
    }
    calcScreenOverflow()
    window.addEventListener("resize", calcScreenOverflow)
    return () => {
      window.removeEventListener("resize", calcScreenOverflow)
    }
  }, [hoverMessageRef, anchorRef, setOffetX])

  return (
    <div
      ref={anchorRef}
      className={cs(style.wrapper, className, {
        [style.hover_enabled]: !!message,
      })}
    >
      {children}
      {message && (
        <div
          ref={hoverMessageRef}
          className={cs(style.hover_message)}
          style={{ transform: `translate(calc(-50% - ${offsetX}px),0px)` }}
        >
          {message}
        </div>
      )}
    </div>
  )
}
