import {
  FxParamControllerProps,
  HTMLInputControllerWithTextInput,
} from "./Controller"
import classes from "./Controller.module.scss"
import { useMemo } from "react"

export function NumberController(props: FxParamControllerProps<"number">) {
  const { options, value } = props
  const min = useMemo(() => {
    if (typeof options?.min === "undefined") return Number.MIN_SAFE_INTEGER
    return options.min
  }, [options?.min])
  const max = useMemo(() => {
    if (typeof options?.max === "undefined") return Number.MAX_SAFE_INTEGER
    return options.max
  }, [options?.max])
  const step = options?.step || 1
  const stringValue = `${value}`
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
        value: null,
      }}
      {...props}
      value={stringValue}
    />
  )
}
