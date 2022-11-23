import React, {
  PropsWithChildren,
  useState,
  useMemo,
  useEffect,
  useCallback,
} from "react"

interface IModalContext {
  modalsOpen: Record<string, boolean>
  openModalId: (modalId: string) => void
  closeModalId: (modalId: string) => void
}

const defaultProperties: IModalContext = {
  modalsOpen: {},
  openModalId: () => {},
  closeModalId: () => {},
}

const defaultCtx: IModalContext = {
  ...defaultProperties,
}

export const ModalContext = React.createContext<IModalContext>(defaultCtx)

export function ModalProvider({ children }: PropsWithChildren<{}>) {
  const [context, setContext] = useState<IModalContext>(defaultCtx)

  const openModalId = useCallback((modalId: string) => {
    setContext((oldContext) => {
      const newContext = {
        ...oldContext,
        modalsOpen: {
          ...oldContext.modalsOpen,
        },
      }
      newContext.modalsOpen[modalId] = true
      return newContext
    })
  }, [])
  const closeModalId = useCallback((modalId: string) => {
    setContext((oldContext) => {
      const newContext = {
        ...oldContext,
        modalsOpen: {
          ...oldContext.modalsOpen,
        },
      }
      delete newContext.modalsOpen[modalId]
      return newContext
    })
  }, [])

  // memoize to prevent rerendering JIC
  const memoizedContext = useMemo<IModalContext>(() => {
    return {
      ...context,
      openModalId,
      closeModalId,
    }
  }, [closeModalId, context, openModalId])

  useEffect(() => {
    const hasModalOpens = Object.keys(context.modalsOpen).length > 0
    if (hasModalOpens) {
      document.body.classList.add("modal-open")
    } else {
      document.body.classList.remove("modal-open")
    }
    return () => {
      document.body.classList.remove("modal-open")
    }
  }, [context.modalsOpen])
  return (
    <ModalContext.Provider value={memoizedContext}>
      {children}
    </ModalContext.Provider>
  )
}
