import style from "./Clamp.module.scss"
import React, { memo, useCallback, useEffect, useRef, useState } from "react"
import { debounce } from "../../utils/debounce"
import { Button } from "../Button"
import cs from "classnames"

const hasClamping = (el: HTMLDivElement) => {
  return el.offsetHeight < el.scrollHeight || el.offsetWidth < el.scrollWidth
}

interface ClampProps {
  children: any | null
  className: string
  onClickCTA?: () => void
  labelCTA?: string
}

const _Clamp = ({ children, className, labelCTA, onClickCTA }: ClampProps) => {
  const [isClamping, setIsClamping] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const checkButtonAvailability = useCallback(() => {
    if (ref.current) {
      setIsClamping(hasClamping(ref.current))
    }
  }, [])

  useEffect(() => {
    if (!onClickCTA) return

    const debouncedCheck = debounce(checkButtonAvailability, 50)
    checkButtonAvailability()
    window.addEventListener("resize", debouncedCheck)
    return () => {
      window.removeEventListener("resize", debouncedCheck)
    }
  }, [checkButtonAvailability, onClickCTA])

  useEffect(() => {
    checkButtonAvailability()
  }, [checkButtonAvailability, className])
  return (
    <>
      <div
        className={cs(style.container, className, {
          [style.container_clamping]: isClamping,
        })}
        ref={ref}
      >
        {children}
      </div>
      {isClamping && (
        <>
          {onClickCTA && (
            <button
              color="transparent"
              className={style.button}
              role="button"
              onClick={onClickCTA}
            >
              {labelCTA}
            </button>
          )}
        </>
      )}
    </>
  )
}

export const Clamp = memo(_Clamp)
