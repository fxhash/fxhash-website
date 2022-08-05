import cs from "classnames"
import style from "./JsonViewer.module.scss"
import dynamic from "next/dynamic"
import { useContext, useState } from "react"
import { SettingsContext } from "../../context/Theme"
import { useClientEffect } from "../../utils/hookts"

let ReactJson: any

interface IProps {
  json: object
  collapsed?: boolean|number
}
export function JsonViewer({ 
  json,
  collapsed = false,
}: IProps) {
  const [ReactJson, setReactJson] = useState<any>(null)
  const settings = useContext(SettingsContext)

  useClientEffect(() => {
    setReactJson(dynamic(() => import("react-json-view")))
  }, [])

  return (
    ReactJson ? (
      <div className={cs(style.root)}>
        <ReactJson
          src={json}
          theme="threezerotwofour"
          collapsed={collapsed}
          name={null}
        />
      </div>
    ): null
  )
}