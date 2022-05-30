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
  removeMessage: (id: string) => void
  addMessage: (message: IMessageSent) => void
  addMessages: (message: IMessageSent[]) => void
}

const defaultProperties: IMessageCenterContext = {
  messages: [],
  removeMessage: () => {},
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
  const memoizedContext = useMemo<IMessageCenterContext>(() => {
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

    const removeMessage = (id: string) => {
      const messages = context.messages.filter(message => message.id !== id)
      setContext({
        ...context,
        messages,
      })
    }

    return {
      ...context,
      removeMessage,
      addMessage,
      addMessages,
    }
  }, [context])

  return (
    <MessageCenterContext.Provider value={memoizedContext}>
      {children}
      <MessageCenterContainer
        messages={memoizedContext.messages}
        removeMessage={memoizedContext.removeMessage}
      />
    </MessageCenterContext.Provider>
  )
}
