import React, { PropsWithChildren, useState, ReactElement } from "react"
import { MessageCenterContainer } from "../components/MessageCenter/MessageCenterContainer"

type TMessageType = "success" | "warning" | "error"

export interface IMessageSent {
  type: TMessageType
  title: string
  content?: ((onRemove: () => void) => ReactElement) | string | null
  keepAlive?: boolean
}

export interface IMessage extends IMessageSent {
  id: string
  createdAt: number
  keepAlive: boolean
}

interface IMessageCenterContext {
  messages: IMessage[]
  removeMessage: (id: string) => void
  addMessage: (message: IMessageSent) => void
  addMessages: (message: IMessageSent[]) => void
  ignoreWarnings: boolean
  setIgnoreWarnings: (state: boolean) => void
}

const defaultProperties: IMessageCenterContext = {
  messages: [],
  removeMessage: () => {},
  addMessage: () => {},
  addMessages: () => {},
  ignoreWarnings: false,
  setIgnoreWarnings: () => {},
}

const defaultCtx: IMessageCenterContext = {
  ...defaultProperties,
}

export const MessageCenterContext =
  React.createContext<IMessageCenterContext>(defaultCtx)

export function MessageCenterProvider({ children }: PropsWithChildren<{}>) {
  const [messages, setMessages] = useState<IMessageCenterContext["messages"]>(
    defaultCtx.messages
  )
  const [ignoreWarnings, setIgnoreWarnings] = useState<
    IMessageCenterContext["ignoreWarnings"]
  >(defaultCtx.ignoreWarnings)

  // adds a message to the list of messages to display
  const addMessage = (message: IMessageSent) => {
    if (!(ignoreWarnings && message.type === "warning")) {
      const toAdd: IMessage = {
        ...message,
        id: "" + Math.random(),
        createdAt: performance.now(),
        keepAlive: message.keepAlive || false,
      }
      setMessages((existing) => [...existing, toAdd])
    }
  }

  const addMessages = (messagesToAdd: IMessageSent[]) => {
    const toAdd: IMessage[] = messagesToAdd
      .filter((message) => (ignoreWarnings ? message.type !== "warning" : true))
      .map((message) => ({
        ...message,
        id: "" + Math.random(),
        createdAt: performance.now(),
        keepAlive: message.keepAlive || false,
      }))
    setMessages((existing) => [...existing, ...toAdd])
  }

  const removeMessage = (id: string) =>
    setMessages((existing) => existing.filter((message) => message.id !== id))

  const context = {
    messages,
    ignoreWarnings,
    addMessage,
    addMessages,
    removeMessage,
    setIgnoreWarnings,
  }

  return (
    <MessageCenterContext.Provider value={context}>
      {children}
      <MessageCenterContainer
        messages={messages}
        removeMessage={removeMessage}
      />
    </MessageCenterContext.Provider>
  )
}
