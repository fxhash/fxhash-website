import style from "./AddBlock.module.scss"
import cs from "classnames"
import { useEffect, useMemo, useRef, useState } from "react"
import effects from "../../../../styles/Effects.module.scss"
import { BlockDefinitions, EArticleBlocks, InstantiableArticleBlocksList } from "../Elements/Blocks"

interface Props {
  onClose: () => void
  onAddBlock: (element: any) => void
  className?: string
}
export function AddBlock({
  onClose,
  onAddBlock,
  className,
}: Props) {
  const markerRef = useRef<HTMLDivElement>(null)
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
      if (markerRef.current) {
        const bounds = markerRef.current.getBoundingClientRect()
        const pos = bounds.y > window.innerHeight * 0.5 ? "up" : "down"
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

  // a list of the button-instantiable elements
  const instantiable = useMemo(() => {
    return InstantiableArticleBlocksList.map(
      type => BlockDefinitions[type as EArticleBlocks]
    ).filter(
      definition => !!definition.buttonInstantiable
    )
  }, [])

  return (
    <>
      <div ref={markerRef}/>
      <div 
        ref={rootRef}
        className={cs(
          style.root,
          style[`pos-${position}`],
          className,
          effects['drop-shadow-small']
        )}
        contentEditable={false}
      >
        <div className={cs(style.buttons)}>
          {instantiable.map((def) => (
            <button
              key={def.name}
              type="button"
              onClick={() => {
                onAddBlock(def.instanciateElement!())
              }}
            >
              {def.icon}
              <span>{def.name}</span>
            </button>
          ))}
        </div>
      </div>
    </>
  )
}