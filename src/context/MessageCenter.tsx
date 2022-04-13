import React, { PropsWithChildren, useState, useCallback, useRef, useEffect, useMemo } from "react"
import { MessageCenterContainer } from "../components/MessageCenter/MessageCenterContainer"


type TMessageType = "success" | "warning" | "error"

interface IMessageSent {
  type: TMessageType
  title: string
  content?: string|null
}

export interface IMessage extends IMessageSent {
  id: string
  createdAt: number
}

interface IMessageCenterContext {
  messages: IMessage[]
  addMessage: (message: IMessageSent) => void
  addMessages: (message: IMessageSent[]) => void
}

const defaultProperties: IMessageCenterContext = {
  messages: [],
  addMessage: () => {},
  addMessages: () => {},
}

const defaultCtx: IMessageCenterContext = {
  ...defaultProperties,
}

export const MessageCenterContext = React.createContext<IMessageCenterContext>(defaultCtx)

export function MessageCenterProvider({ children }: PropsWithChildren<{}>) {
  const [context, setContext] = useState<IMessageCenterContext>(defaultCtx)
  
  // memoize to prevent rerendering JIC
  const withAddMessage = useMemo<IMessageCenterContext>(() => {
    // adds a message to the list of messages to display
    const addMessage = (message: IMessageSent) => {
      const toAdd: IMessage = {
        ...message,
        id: ""+Math.random(),
        createdAt: performance.now(),
      }
      setContext({
        ...context,
        messages: [
          ...context.messages,
          toAdd,
        ]
      })
    }

    const addMessages = (messages: IMessageSent[]) => {
      const toAdd: IMessage[] = messages.map(message => ({
        ...message,
        id: ""+Math.random(),
        createdAt: performance.now(),
      }))
      setContext({
        ...context,
        messages: [
          ...context.messages,
          ...toAdd,
        ]
      })
    }

    return {
      ...context,
      addMessage,
      addMessages,
    }
  }, [context])

  const removeMessage = (id: string) => {
    const messages = context.messages.filter(message => message.id !== id)
    setContext({
      ...context,
      messages,
    })
  }

  return (
    <MessageCenterContext.Provider value={withAddMessage}>
      {children}
      <MessageCenterContainer
        messages={context.messages}
        removeMessage={removeMessage}
      />
    </MessageCenterContext.Provider>
  )
}