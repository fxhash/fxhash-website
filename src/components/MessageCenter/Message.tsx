import style from "./Message.module.scss"
import cs from "classnames"
import { IMessage } from "../../context/MessageCenter"
import { useEffect, useRef, useState } from "react"

export interface MessageProps {
  message: IMessage
  onRemove: () => void
}
export function Message({ message, onRemove }: MessageProps) {
  const [hidden, setHidden] = useState<boolean>(false)

  const { type, title, content, keepAlive } = message

  const icon =
    type === "error"
      ? "fas fa-times-circle"
      : type === "warning"
      ? "fas fa-exclamation-circle"
      : "fas fa-check-circle"

  return (
    <div
      className={cs(
        style.root,
        style[`type_${type}`],
        {
          [style.hidden]: hidden,
        },
        "message"
      )}
      onTransitionEnd={() => {
        if (keepAlive) return
        onRemove()
      }}
    >
      <div className={cs(style.header)}>
        <i className={icon} aria-hidden />
        <div className={cs(style.title)}>{title}</div>
      </div>
      {content && (
        <div className={cs(style.content)}>
          {typeof content === "function" ? content(onRemove) : content}
        </div>
      )}
      <div
        className={!keepAlive ? cs(style.loader, "loader") : undefined}
        onAnimationEnd={() => {
          if (keepAlive) return
          setHidden(true)
        }}
      />
      <button className={cs(style.close)} onClick={onRemove}>
        <i className="far fa-times" aria-hidden />
      </button>
    </div>
  )
}
