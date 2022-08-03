import React, { PropsWithChildren, useState, useCallback, useRef, useEffect } from "react"
import { useClientAsyncEffect, useClientEffect } from "../utils/hookts"
import { Cycle } from "../types/Cycles"
import { API_BLOCKCHAIN_CONTRACT_STORAGE, API_CYCLES_LIST } from "../services/Blockchain"


interface ICyclesContext {
  loading: boolean
  error: boolean
  cycles: Cycle[][]
}

const defaultProperties: ICyclesContext = {
  loading: true,
  error: false,
  cycles: [],  
}

const defaultCtx: ICyclesContext = {
  ...defaultProperties,
}

export const CyclesContext = React.createContext<ICyclesContext>(defaultCtx)

export function CyclesProvider({ children }: PropsWithChildren<{}>) {
  const [context, setContext] = useState<ICyclesContext>(defaultCtx)

  useClientAsyncEffect(async (isMounted) => {
    try {
      // get the cycles
      const cycleUpdatesData = await fetch(API_CYCLES_LIST)
      const cycleUpdates = await cycleUpdatesData.json()
  
      const cycles: Cycle[] = cycleUpdates.map((update: any) => ({
        start: new Date(update.content.value.start),
        opening: parseInt(update.content.value.opening_duration),
        closing: parseInt(update.content.value.closing_duration),
      }))
  
      // get the storage of the mint_issuer_allowed contract (to get the IDs of the cycles opened)
      const allowedStorageData = await fetch(
        API_BLOCKCHAIN_CONTRACT_STORAGE(
          process.env.NEXT_PUBLIC_TZ_CT_ADDRESS_ALLOWED_MINT_ISSUER!
        )
      )
      const allowedStorage = await allowedStorageData.json()

      // finally get the active cycles
      const activeCycles = allowedStorage.cycle_ids.map(
        (ids: string[]) => ids.map(
          (id: string) => cycles[parseInt(id)]
        )
      )

      setContext({
        loading: false,
        error: false,
        cycles: activeCycles
      })
    }
    catch {
      if (isMounted()) {
        setContext({
          ...context,
          error: true
        })
      }
    }
  }, [])

  return (
    <CyclesContext.Provider value={context}>
      {children}
    </CyclesContext.Provider>
  )
}
