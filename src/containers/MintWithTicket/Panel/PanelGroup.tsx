import style from "./PanelGroup.module.scss"
import cs from "classnames"
import { PropsWithChildren, ReactChild } from "react"
import { useAriaTooltip } from "hooks/useAriaTooltip"

type Props = PropsWithChildren<{
  title: string
  description?: string
  descriptionClassName?: string
  headerComp?: ReactChild
}>
export function PanelGroup({
  title,
  headerComp,
  description,
  descriptionClassName,
  children,
}: Props) {
  const { showTooltip, handleLeave, handleEnter, hoverElement } =
    useAriaTooltip()
  return (
    <div className={cs(style.root)}>
      <div className={cs(style.header)}>
        <div className={cs(style.title_wrapper)}>
          <h2 className={cs(style.title)}>{title}</h2>
          {description && (
            <i
              ref={hoverElement}
              className={cs(
                "fa-sharp fa-solid fa-circle-info",
                style.info_icon
              )}
              onMouseEnter={handleEnter}
              onMouseLeave={handleLeave}
              onBlur={handleLeave}
              onFocus={handleEnter}
              tabIndex={0}
            />
          )}
          {description && showTooltip && (
            <span
              role="tooltip"
              aria-live="polite"
              aria-hidden={!showTooltip}
              className={style.tooltip}
            >
              {description}
            </span>
          )}
        </div>
        {headerComp && (
          <div className={cs(style.header_child)}>{headerComp}</div>
        )}
      </div>
      <div className={cs(style.content)}>{children}</div>
    </div>
  )
}
