import style from "./AddBlock.module.scss"
import cs from "classnames"
import { useEffect, useRef, useState } from "react"
import effects from "../../../../styles/Effects.module.scss"

interface Props {
  onClose: () => void
  className?: string
}
export function AddBlock({
  onClose,
  className,
}: Props) {
  const rootRef = useRef<HTMLDivElement>(null)
  const [position, setPosition] = useState<"up"|"down">("up")
  const positionRef = useRef<"up"|"down">("up")

  // add an event listener to the document to know if a click outside was made
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const path = (event as any).path
      if (path && path.length > 0 && rootRef.current) {
        if (!path.includes(rootRef.current)) {
          onClose()
        }
      }
    }

    const onScroll = () => {
      if (rootRef.current) {
        const bounds = rootRef.current.getBoundingClientRect()
        const Y = bounds.y + bounds.height * 0.5
        const pos = Y > window.innerHeight * 0.5 ? "up" : "down"
        if (pos !== positionRef.current) {
          positionRef.current = pos
          setPosition(pos)
        }
      }
    }

    onScroll()

    document.addEventListener("click", onClick)
    document.addEventListener("scroll", onScroll)

    return () => {
      document.removeEventListener("click", onClick)
      document.removeEventListener("scroll", onScroll)
    }
  }, [])

  return (
    <>
      <div ref={rootRef}/>
      <div 
        className={cs(style.root, style[`pos-${position}`], className, effects['drop-shadow-big'])}
        contentEditable={false}
      >
        add blocks !
        <p>more content</p>
      </div>
    </>
  )
}