import React, { useRef, useState, useMemo } from "react"
import { useParams, usePaneOfParams } from "../../context/Params"
import { IParameterDefinition } from "../../components/Params/tweakpane"
import { Pane } from "../../components/Params/Pane"
import classes from "./ConfigurationPane.module.scss"

const options = [
  {
    value: "number",
    label: "number",
  },
  {
    value: "boolean",
    label: "boolean",
  },
  {
    value: "color",
    label: "color",
  },
  {
    value: "string",
    label: "string",
  },
  {
    value: "select",
    label: "select",
  },
]

interface IConfigurationPane {
  params: IParameterDefinition[]
}

export function ConfigurationPane({ params }: IConfigurationPane) {
  const paneContainer = useRef<HTMLDivElement>(null)

  const controller = useParams(params, paneContainer)

  const handleReset = () => {
    controller.setParam("factor", 1000)
  }

  return (
    <div>
      <div ref={paneContainer} />
      <Pane />
      {/*
      <Pane params={["factor"]} />
      <Pane params={["factor", "title"]} />
      <Pane params={["factor"]} />
      <Pane params={["factor"]} />
       */}
    </div>
  )
}
