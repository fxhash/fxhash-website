import React, { memo } from "react"
import { faTriangleExclamation } from "@fortawesome/free-solid-svg-icons"
import { GenTokFlag } from "types/entities/GenerativeToken"
import { useAriaTooltip } from "hooks/useAriaTooltip"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { getFlagText } from "containers/Generative/FlagBanner"
import style from "../TableUser.module.scss"

const _ModeratedFlag = ({ flag }: { flag: GenTokFlag }) => {
  const { hoverElement, showTooltip, handleEnter, handleLeave } =
    useAriaTooltip()

  return (
    <div onMouseEnter={handleEnter} onMouseLeave={handleLeave}>
      <FontAwesomeIcon
        className={style.warningIcon}
        ref={hoverElement}
        tabIndex={0}
        onFocus={handleEnter}
        onBlur={handleLeave}
        icon={faTriangleExclamation}
      />

      {showTooltip && (
        <span
          className={style.tooltip}
          role="tooltip"
          aria-hidden={!showTooltip}
          aria-live="polite"
        >
          {getFlagText(flag)}
        </span>
      )}
    </div>
  )
}

export const ModeratedFlag = memo(_ModeratedFlag)
