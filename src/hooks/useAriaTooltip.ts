import { useState, useRef } from "react"

export function useAriaTooltip() {
  const hoverElement = useRef(null)
  const [wasHovered, setWasHovered] = useState(false)
  const [showTooltip, setShowTooltip] = useState(false)
  const handleEnter = () => {
    if (!wasHovered) setWasHovered(true)
    setShowTooltip(true)
  }
  const handleLeave = () => {
    if (document.activeElement === hoverElement.current) return
    setShowTooltip(false)
  }
  return {
    showTooltip,
    wasHovered,
    hoverElement,
    handleEnter,
    handleLeave,
  }
}
