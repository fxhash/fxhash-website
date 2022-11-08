import React, { useRef, useState, useMemo } from "react"
import { useParams, usePaneOfParams, ParamsSchema } from "../../context/Params"
import { IOptions, Select } from "../../components/Input/Select"
import classes from "./ConfigurationPane.module.scss"
export type FxParamType = "number" | "boolean" | "color" | "string" | "select"

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

export function ConfigurationPane() {
  const [selectedOption, setSelectedOption] = useState(options[0].value)
  const [params, setParams] = useState({
    factor: 123,
    title: "hello",
    color: 0xff0055,
  })
  const paneContainer = useRef<HTMLDivElement>(null)

  const controller = useParams(params, paneContainer)

  console.log('controller')

  const handleReset = () => {
    controller.setParam("factor", 1000)
  }
  const handleChangeSelectedOption = (value: any) => {
    setSelectedOption(value)
  }


  const p = useMemo(() => ["factor"], [])

  return (
    <div>
      <div ref={paneContainer} />

      <div className={classes.selectContainer}>
        <Select
          classNameRoot={classes.select}
          className={classes.select}
          value={selectedOption}
          options={options}
          onChange={handleChangeSelectedOption}
        />
        <button>add</button>
      </div>
      <Pane params={["factor"]} />
      <Pane params={["factor", "title"]} />
      <Pane params={["factor"]} />
      <Pane params={["factor"]} />
    </div>
  )
}
