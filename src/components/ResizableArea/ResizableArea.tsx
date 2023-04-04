import React, {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react"
import style from "./ResizableArea.module.scss"
import cs from "classnames"
import useWindowSize, { breakpoints } from "../../hooks/useWindowsSize"
import { off, on } from "../../utils/events"
import { floorToDecimalNb } from "../../utils/math"

interface ResizableAreaProps {
  className?: string
  resizableComponent: (props: {
    show: boolean
    onToggleVisibility: (newState: boolean) => () => void
  }) => React.ReactNode
  children: any
}

const _ResizableArea = ({
  resizableComponent,
  children,
  className,
}: ResizableAreaProps) => {
  const { width } = useWindowSize()
  const isMobile = useMemo(() => {
    return (width || 0) < breakpoints.sm
  }, [width])

  const [widthPanel, setWidthPanel] = useState(400)
  const [translationYPanel, setTranslationYPanel] = useState(25)
  const [showPanel, setShowPanel] = useState(true)
  const [isDragging, setIsDragging] = useState(false)
  const refContainer = useRef<HTMLDivElement>(null)
  const refResizeEdge = useRef<HTMLDivElement>(null)

  const handleToggleShowPanel = useCallback(
    (newState) => () => {
      if (isMobile && newState && translationYPanel > 90) {
        setTranslationYPanel(50)
      }
      setShowPanel(newState)
    },
    [isMobile, translationYPanel]
  )

  const handleResizeEdgeMouseDown = useCallback(() => {
    setIsDragging(true)
  }, [])
  const handleContainerMouseUp = useCallback(() => {
    setIsDragging(false)
  }, [])
  const handleContainerMouseMove = useCallback(
    (e) => {
      if (!refResizeEdge.current) return
      if (isMobile) {
        const moveY = e.clientY
        const windowH = window.innerHeight
        let percentYView = (moveY * 100) / windowH
        if (percentYView < 25) {
          percentYView = 25
        }
        if (percentYView > 90) {
          setShowPanel(false)
        }
        setTranslationYPanel(floorToDecimalNb(percentYView, 2))
      } else {
        const moveX = e.x
        setWidthPanel(
          moveX - refResizeEdge.current.getBoundingClientRect().width / 2
        )
      }
    },
    [isMobile]
  )
  const handleContainerTouchMove = useCallback(
    (e) => {
      if (!refResizeEdge.current) return
      const [touche] = e.touches
      if (isMobile) {
        const moveY = touche.clientY
        const windowH = window.innerHeight
        let percentYView = (moveY * 100) / windowH
        if (percentYView < 25) {
          percentYView = 25
        }
        if (percentYView > 90) {
          setShowPanel(false)
        }
        setTranslationYPanel(floorToDecimalNb(percentYView, 2))
      } else {
        const moveX = touche.clientX
        setWidthPanel(
          moveX - refResizeEdge.current.getBoundingClientRect().width / 2
        )
      }
    },
    [isMobile]
  )

  useEffect(() => {
    const currentRefResizeEdge = refResizeEdge.current
    const currentRefContainer = refContainer.current
    if (currentRefResizeEdge) {
      on(currentRefResizeEdge, "mousedown", handleResizeEdgeMouseDown)
      on(currentRefResizeEdge, "touchstart", handleResizeEdgeMouseDown, {
        passive: true,
      })
    }
    if (currentRefContainer) {
      on(currentRefContainer, "mouseup", handleContainerMouseUp)
      on(currentRefContainer, "touchend", handleContainerMouseUp, {
        passive: true,
      })
    }
    return () => {
      if (currentRefResizeEdge) {
        off(currentRefResizeEdge, "mousedown", handleResizeEdgeMouseDown)
        off(currentRefResizeEdge, "touchstart", handleResizeEdgeMouseDown)
      }
      if (currentRefContainer) {
        off(currentRefContainer, "mouseup", handleContainerMouseUp)
        off(currentRefContainer, "touchend", handleContainerMouseUp)
      }
    }
  }, [handleContainerMouseUp, handleResizeEdgeMouseDown])

  useEffect(() => {
    const currentRefContainer = refContainer.current
    if (isDragging && currentRefContainer) {
      on(currentRefContainer, "mousemove", handleContainerMouseMove)
      on(currentRefContainer, "touchmove", handleContainerTouchMove, {
        passive: true,
      })
    }
    return () => {
      if (currentRefContainer) {
        off(currentRefContainer, "mousemove", handleContainerMouseMove)
        off(currentRefContainer, "touchmove", handleContainerTouchMove)
      }
    }
  }, [handleContainerMouseMove, handleContainerTouchMove, isDragging])

  const resizableComponentProps = useMemo(
    () => ({ show: showPanel, onToggleVisibility: handleToggleShowPanel }),
    [handleToggleShowPanel, showPanel]
  )
  const stylePanel = isMobile
    ? {
        maxWidth: "100%",
        height: `${100 - translationYPanel}%`,
        top: `${translationYPanel}%`,
      }
    : {
        maxWidth: `min(${widthPanel}px, 90vw)`,
        height: "100%",
      }
  const styleChild = {
    height: isMobile && showPanel ? `${translationYPanel}%` : "100%",
  }

  return (
    <div
      ref={refContainer}
      className={cs(style.container, className, {
        [style.is_dragging]: isDragging,
        [style.show_panel]: showPanel,
      })}
    >
      <div style={stylePanel} className={style.panel}>
        <>
          <div className={style.panel_comp}>
            {resizableComponent(resizableComponentProps)}
          </div>
          <div ref={refResizeEdge} className={style.resize_edge} />
        </>
      </div>
      <div className={style.child} style={styleChild}>
        <>
          <div className={style.child_mask} />
          {children}
        </>
      </div>
      {!showPanel && (
        <button
          title="show panel"
          className={style.button_show}
          type="button"
          onClick={handleToggleShowPanel(true)}
        >
          <span>Edit</span>
          <i aria-hidden className="fa-sharp fa-solid fa-chevrons-right" />
        </button>
      )}
    </div>
  )
}

export const ResizableArea = memo(_ResizableArea)
