import cs from "classnames"
import dynamic from "next/dynamic"
import { useState } from "react"
import { useClientEffect } from "../../utils/hookts"

let ReactJson: any

export function JsonViewer({ json }: { json: object }) {
  const [ReactJson, setReactJson] = useState<any>(null)

  useClientEffect(() => {
    setReactJson(dynamic(() => import("react-json-view")))
  }, [])

  return (
    ReactJson ? <ReactJson src={json} /> : null
  )
}