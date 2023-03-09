import style from "./PanelGroup.module.scss"
import cs from "classnames"
import { PropsWithChildren, ReactChild } from "react"

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
  return (
    <div className={cs(style.root)}>
      <div className={cs(style.header)}>
        <div className={cs(style.title_wrapper)}>
          <h2 className={cs(style.title)}>{title}</h2>
          {description && (
            <i
              className={cs(
                "fa-sharp fa-solid fa-circle-info",
                style.info_icon
              )}
              aria-hidden
              title={description}
            />
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
