import React, { PropsWithChildren, useState, useCallback, useRef, useEffect, useMemo } from "react"
import { MessageCenterContainer } from "../components/MessageCenter/MessageCenterContainer"


type TMessageType = "success" | "warning" | "error"

export interface IMessageSent {
  type: TMessageType
  title: string
  content?: string|null
}

export interface IMessage extends IMessageSent {
  id: string
  createdAt: number
}

interface IMessageCenterContext {
  ready: boolean
  messages: IMessage[]
  removeMessage: (id: string) => void
  addMessage: (message: IMessageSent) => void
  addMessages: (message: IMessageSent[]) => void
  ignoreWarnings: boolean
  setIgnoreWarnings: (state: boolean) => void
}

const defaultProperties: IMessageCenterContext = {
  ready: false,
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

export const MessageCenterContext = React.createContext<IMessageCenterContext>(defaultCtx)

export function MessageCenterProvider({ children }: PropsWithChildren<{}>) {
  const [context, setContext] = useState<IMessageCenterContext>(defaultCtx)
  
  // memoize to prevent rerendering JIC
  const memoizedContext = useMemo<IMessageCenterContext>(() => {
    // adds a message to the list of messages to display
    const addMessage = (message: IMessageSent) => {
      if (!(context.ignoreWarnings && message.type === "warning")) {
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
    }

    const addMessages = (messages: IMessageSent[]) => {
      const toAdd: IMessage[] = messages
        .filter(
          message => context.ignoreWarnings ? message.type !== "warning" : true
        )
        .map(message => ({
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

    const setIgnoreWarnings = (state: boolean) => {
      setContext({
        ...context,
        ignoreWarnings: state,
      })
    }

    return {
      ...context,
      ready: true, // once methods are defined it's ready to be consumed
      removeMessage,
      addMessage,
      addMessages,
      setIgnoreWarnings,
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
