import React, { PropsWithChildren, useState, useCallback, useRef, useEffect } from "react"
import { useClientEffect } from "../utils/hookts"
import style from "./Theme.module.scss"
import cs from "classnames"


interface ISettingsProperties {
  darkTheme: boolean
  spaceBetweenCards: number
  displayPricesCard: boolean
  displayBurntCard: boolean
  displayInfosGenerativeCard: boolean
  displayInfosGentkCard: boolean
  borderWidthCards: number
  shadowCards: number
}

export interface ISettingsContext extends ISettingsProperties {
  update: (key: keyof ISettingsProperties, value: any) => void
}

const defaultProperties: ISettingsProperties = {
  darkTheme: false,
  spaceBetweenCards: 30,
  borderWidthCards: 3,
  shadowCards: 19,
  displayInfosGenerativeCard: true,
  displayInfosGentkCard: true,
  displayPricesCard: false,
  displayBurntCard: false,
}

const defaultCtx: ISettingsContext = {
  ...defaultProperties,
  update: () => {}
}

export const SettingsContext = React.createContext<ISettingsContext>(defaultCtx)

export function SettingsProvider({ children }: PropsWithChildren<{}>) {
  const [context, setContext] = useState<ISettingsContext>(defaultCtx)
  const ref = useRef<ISettingsContext>(context)

  const updateContext = (ctx: ISettingsContext) => {
    setContext(ctx)
    ref.current = ctx
  }

  const update = (key: keyof ISettingsProperties, value: any) => {
    const newContext = {
      ...ref.current,
      [key]: value
    }
    updateContext(newContext)
    localStorage.setItem("settings", JSON.stringify(newContext))
  }

  useClientEffect(() => {
    // check for the settings in the local storage
    const fromStorage = localStorage.getItem("settings")
    const values = fromStorage ? JSON.parse(fromStorage) : defaultProperties
    updateContext({
      ...defaultProperties,
      ...values,
      update
    })
  }, [])

  // triggers whenever settings change
  useEffect(() => {
    // update some css variables with numeric inputs
    const root = document.documentElement
    root.style.setProperty("--cards-border-width", `${context.borderWidthCards}px`)
    root.style.setProperty("--cards-shadow", `${context.shadowCards}px`)
    root.style.setProperty("--cards-gap", `${context.spaceBetweenCards}px`)
  }, [context])

  return (
    <SettingsContext.Provider value={context}>
      <div className={cs(style.root_wrapper, { "dark": context.darkTheme })}>
        { children }
      </div>
    </SettingsContext.Provider>
  )
}