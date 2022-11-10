import React, { useRef, useState, useMemo } from "react"
import { useParams, usePaneOfParams } from "../../context/Params"
import { IParameterDefinition } from "../../context/tweakpane"

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

interface IPaneProps {
  params: string[]
}

export function Pane(props: IPaneProps) {
  const params = useMemo(() => props.params, [JSON.stringify(props.params)])
  const pane = useRef<HTMLDivElement>(null)
  const data = usePaneOfParams(params, pane)
  console.log(data)
  return <div ref={pane} />
}

interface IConfigurationPane {
  params: IParameterDefinition[]
}

export function ConfigurationPane({ params }: IConfigurationPane) {
  const paneContainer = useRef<HTMLDivElement>(null)

  const controller = useParams(params, paneContainer)

  const handleReset = () => {
    controller.setParam("factor", 1000)
  }

  console.log(controller)

  return (
    <div>
      <div ref={paneContainer} />
      <Pane params={["number_id"]} />
      {/*
      <Pane params={["factor"]} />
      <Pane params={["factor", "title"]} />
      <Pane params={["factor"]} />
      <Pane params={["factor"]} />
       */}
    </div>
  )
}
