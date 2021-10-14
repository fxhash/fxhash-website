import { useLazyQuery } from "@apollo/client"
import React, { PropsWithChildren, useState, useRef } from "react"
import { Qu_user } from "../queries/user"
import { WalletManager } from "../services/Wallet"
import { ConnectedUser } from "../types/entities/User"
import { useClientAsyncEffect, useClientEffect } from "../utils/hookts"


interface UserContextType {
  user: ConnectedUser|null
  walletManager: WalletManager|null
  connect: () => void
  disconnect: () => void
}

const defaultCtx: UserContextType = {
  user: null,
  walletManager: null,
  connect: () => {},
  disconnect: () => {}
}

export const UserContext = React.createContext<UserContextType>(defaultCtx)

export function UserProvider({ children }: PropsWithChildren<{}>) {
  const [context, setContext] = useState<UserContextType>(defaultCtx)
  // keep a reference to the context to be used in functions
  const ctxRef = useRef<UserContextType>(context)

  const [getUser, { data: userData }] = useLazyQuery(Qu_user)

  // keep ctxRef in-sync with the context state
  useClientEffect(() => {
    ctxRef.current = context
  }, [context])

  // keep user in context in-sync with the user data from query
  useClientEffect(() => {
    if (userData && userData.user) {
      setContext({
        ...context,
        user: userData.user
      })
    }
  }, [userData])

  // asks the manager for a connection
  const connect = async () => {
    const ctx = ctxRef.current

    if (ctx.walletManager) {
      const pkh = await ctx.walletManager.connect()
      if (pkh) {
        // user is connected, we can update context and request gql api for user data
        const ctx = { ...context }
        ctx.user = {
          id: pkh
        }
        setContext(ctx)
        // todo call gql api
      }
    }
  }
  
  // asks the manager for a disconnect & clears the context
  const disconnect = () => {}

  useClientAsyncEffect(async (isMounted) => {
    const initCtx: UserContextType = { 
      ...defaultCtx,
      connect,
      disconnect,
    }

    // instanciate the manager
    const manager = new WalletManager()
    initCtx.walletManager = manager

    // check if user is already connected
    const pkh = await manager.connectFromStorage()
    if (pkh) {
      initCtx.user = {
        id: pkh
      }
      // todo: call gql API to get extra data from the user
      getUser({
        variables: {
          id: pkh
        }
      })
    }

    // move data to context
    setContext(initCtx)
  }, [])

  return (
    <UserContext.Provider value={context}>
      { children }
    </UserContext.Provider>
  )
}