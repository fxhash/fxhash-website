import style from "./Message.module.scss"
import cs from "classnames"
import { IMessage } from "../../context/MessageCenter"
import { useEffect, useRef, useState } from "react"

interface Props {
  message: IMessage
  onRemove: () => void
}
export function Message({
  message,
  onRemove,
}: Props) {
  const [hidden, setHidden] = useState<boolean>(false)

  const icon = message.type === "error" ? "fas fa-times-circle"
             : message.type === "warning" ? "fas fa-exclamation-circle"
             : "fas fa-check-circle"

  return (
    <div
      className={cs(style.root, style[`type_${message.type}`], {
        [style.hidden]: hidden,
      }, "message")}
      onTransitionEnd={onRemove}
    >
      <div className={cs(style.header)}>
        <i className={icon} aria-hidden />
        <div className={cs(style.title)}>
          {message.title}
        </div>
      </div>
      {message.content && (
        <div 
          className={cs(style.content)}
        >
          {message.content}
        </div>
      )}
      <div 
        className={cs(style.loader, "loader")}
        onAnimationEnd={() => setHidden(true)}
      />
      <button
        className={cs(style.close)}
        onClick={onRemove}
      >
        <i className="far fa-times" aria-hidden />
      </button>
    </div>
  )
}