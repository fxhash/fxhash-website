import style from "./Settings.module.scss"
import cs from "classnames"
import { useContext, useEffect, useRef, useState } from "react"
import { Switch } from "../../components/Input/Switch"
import { SettingsContext } from "../../context/Theme"

interface Props {
  className?: string
}
export function Settings({
  className
}: Props) {
  const settings = useContext(SettingsContext)

  return (
    <div className={cs(style.root, className)}>
      <strong>Dark mode</strong>
      <Switch 
        onChange={(value) => settings.update("darkTheme", value)} 
        value={settings.darkTheme}
      />

      <strong>Display prices Generative</strong>
      <Switch 
        onChange={(value) => settings.update("displayPricesCard", value)} 
        value={settings.displayPricesCard}
      />
    </div>
  )  
}