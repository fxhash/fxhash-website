import style from "./BlockMenu.module.scss"
import cs from "classnames"
import { PropsWithChildren, useEffect, useRef, useState } from "react"
import { ContextualMenu } from "../../../Menus/ContextualMenu"

interface Props {
  className?: string
  onClose: () => void
}
export function BlockMenu({
  className,
  onClose,
  children,
}: PropsWithChildren<Props>) {
  const [isInit, setIsInit] = useState(false)
  const markerRef = useRef<HTMLDivElement>(null)
  const rootRef = useRef<HTMLDivElement>(null)
  const [position, setPosition] = useState<"up" | "down">("up")
  const positionRef = useRef<"up" | "down">("up")

  // add an event listener to the document to know if a click outside was made
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (!rootRef?.current || rootRef.current.contains(event.target as Node)) {
        // inside click
        return
      }
      onClose()
    }

    const onScroll = () => {
      if (markerRef.current) {
        const bounds = markerRef.current.getBoundingClientRect()
        const pos = bounds.y > window.innerHeight * 0.5 ? "up" : "down"
        if (pos !== positionRef.current) {
          positionRef.current = pos
          setPosition(pos)
        }
      }
      setIsInit(true)
    }

    const onKeyPressed = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault()
        onClose()
      }
    }

    onScroll()

    document.addEventListener("mousedown", onClick)
    document.addEventListener("scroll", onScroll)
    document.addEventListener("keydown", onKeyPressed)

    return () => {
      document.removeEventListener("mousedown", onClick)
      document.removeEventListener("scroll", onScroll)
      document.removeEventListener("keydown", onKeyPressed)
    }
  }, [onClose])

  return (
    <>
      <div ref={markerRef} />
      <ContextualMenu
        ref={rootRef}
        className={cs(style.root, style[`pos-${position}`], className, {
          [style.show]: isInit,
        })}
      >
        {children}
      </ContextualMenu>
    </>
  )
}
