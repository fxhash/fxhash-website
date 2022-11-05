import React, { useRef, useState, useMemo } from "react"
import { useParams, usePaneOfParams } from "../../context/Params"
import { IOptions, Select } from "../../components/Input/Select"
import classes from './ConfigurationPane.module.scss';
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

export function ConfigurationPane() {
  const [selectedOption, setSelectedOption] = useState(options[0].value)
  const [params, setParams] = useState({
    factor: 123,
    title: "hello",
    color: 0xff0055,
  })
  const paneContainer = useRef<HTMLDivElement>(null)
  const subPane = useRef<HTMLDivElement>(null)
  const subPane2 = useRef<HTMLDivElement>(null)
  const subPane3 = useRef<HTMLDivElement>(null)

  const controller = useParams(params, paneContainer)

  console.log(controller)

  const prams = useMemo( () => ["factor"], [])
  const prams2 = useMemo( () => ["factor", "color"], [])

  usePaneOfParams(prams, subPane)
  usePaneOfParams(prams2, subPane2)
 // usePaneOfParams(["factor", "title"], subPane3)

  const handleReset = () => {
    controller.setParam("factor", 1000)
  }
  const handleChangeSelectedOption = (value) => {
    setSelectedOption(value)
  }
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
      <div ref={subPane} />
      <div ref={subPane2} />
      <div ref={subPane3} />
    </div>
  )
}
