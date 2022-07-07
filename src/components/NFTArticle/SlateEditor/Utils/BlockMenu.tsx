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
  const markerRef = useRef<HTMLDivElement>(null)
  const rootRef = useRef<HTMLDivElement>(null)
  const [position, setPosition] = useState<"up"|"down">("up")
  const positionRef = useRef<"up"|"down">("up")

  // add an event listener to the document to know if a click outside was made
  useEffect(() => {
    const onPointerDown = (event: MouseEvent) => {
      const path = (event as any).path
      if (path && path.length > 0 && rootRef.current) {
        if (!path.includes(rootRef.current)) {
          onClose()
        }
      }
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
    }

    const onKeyPressed = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose()
      }
    }
  
    onScroll();

    document.addEventListener("pointerdown", onPointerDown)
    document.addEventListener("scroll", onScroll)
    document.addEventListener("keydown", onKeyPressed)

    return () => {
      document.removeEventListener("pointerdown", onPointerDown)
      document.removeEventListener("scroll", onScroll)
      document.removeEventListener("keydown", onKeyPressed)
    }
  }, [])

  return (
    <>
      <div ref={markerRef}/>
      <ContextualMenu
        ref={rootRef}
        className={cs(
          style.root,
          style[`pos-${position}`],
          className,
        )}
      >
        {children}
      </ContextualMenu>
    </>
  )
}
