import style from "./MessageCenterContainer.module.scss"
import cs from "classnames"
import { IMessage } from "../../context/MessageCenter"
import { Message } from "./Message"

interface Props {
  messages: IMessage[]
  removeMessage: (id: string) => void
}
export function MessageCenterContainer({ messages, removeMessage }: Props) {
  return (
    <div className={cs(style.root)}>
      {messages.map((message) => (
        <Message
          key={message.id}
          message={message}
          onRemove={() => removeMessage(message.id)}
        />
      ))}
    </div>
  )
}
