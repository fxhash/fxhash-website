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

  const containerRef = useRef<HTMLDivElement>(null)
  const [checked, setChecked] = useState(false)

  useEffect(() => {
    const listener = (evt: MouseEvent) => {
      evt.stopPropagation()
    }
    containerRef.current?.addEventListener("click", listener)

    return () => {
      containerRef.current?.removeEventListener("click", listener)
    }
  }, [])

  return (
    <div className={cs(style.root, className)} ref={containerRef}>
      <div className={cs(style.line)}>
        <strong>Dark mode</strong>
        <Switch 
          onChange={(value) => settings.update("darkTheme", value)} 
          value={settings.darkTheme}
        />
      </div>
    </div>
  )  
}