import React, { useRef, useState, useMemo, useContext } from "react"
import { useParams, usePaneOfParams, ParamsContext } from "../../context/Params"
import { Pane } from "../../components/Params/Pane"
import classes from "./ConfigurationPane.module.scss"
import { FxParamDefinition } from "../../components/Params/types"

interface IConfigurationPane {
  params: FxParamDefinition<any>[]
}

export function ConfigurationPane({ params }: IConfigurationPane) {
  const paneContainer = useRef<HTMLDivElement>(null)

  const controller = useParams(params, paneContainer)
  const { data } = useContext(ParamsContext)

  const handleReset = () => {
    controller.setParam("factor", 1000)
  }

  return (
    <div>
      <Pane />
      <Pane params={["number_id"]} />
      <Pane params={["number_id"]} />
      <Pane params={["boolean_id"]} />
    </div>
  )
}
