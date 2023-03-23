import {
  FxParamControllerProps,
  HTMLInputControllerWithTextInput,
} from "./Controller"
import classes from "./Controller.module.scss"
import { useEffect, useMemo, useState } from "react"

export function NumberController(props: FxParamControllerProps<"number">) {
  const { options, value, onChange } = props
  const min = useMemo(() => {
    if (typeof options?.min === "undefined") return Number.MIN_SAFE_INTEGER
    return options.min
  }, [options?.min])
  const max = useMemo(() => {
    if (typeof options?.max === "undefined") return Number.MAX_SAFE_INTEGER
    return options.max
  }, [options?.max])
  const step = options?.step || 1
  const [textValue, setTextValue] = useState(value)
  const handleChangeTextValue = (e: any) => {
    const val = e.target.value
    setTextValue(val)
    if (!isNaN(val) && val.length > 0) {
      onChange(e)
    }
  }

  useEffect(() => {
    setTextValue(`${value}`)
  }, [value])

  return (
    <HTMLInputControllerWithTextInput
      type="range"
      inputProps={{ min, max, step }}
      textInputProps={{
        type: "number",
        min,
        max,
        step,
        className: classes.numberInput,
        value: textValue,
        onChange: handleChangeTextValue,
      }}
      {...props}
      value={value}
    />
  )
}
