import {
  FxParamControllerProps,
  HTMLInputControllerWithTextInput,
} from "./Controller"
import classes from "./Controller.module.scss"
import { MAX_SAFE_INT64, MIN_SAFE_INT64 } from "../utils"
import { useMemo } from "react"

export function BigIntController(props: FxParamControllerProps<"bigint">) {
  const { options, value } = props
  const min = useMemo(() => {
    if (typeof options?.min === "undefined") return MIN_SAFE_INT64
    return options.min
  }, [options?.min])
  const max = useMemo(() => {
    if (typeof options?.max === "undefined") return MAX_SAFE_INT64
    return options.max
  }, [options?.max])
  const stringValue = `${value}`
  return (
    <HTMLInputControllerWithTextInput
      type="range"
      inputProps={{ min: `${min}`, max: `${max}` }}
      textInputProps={{
        type: "number",
        min: `${min}`,
        max: `${max}`,
        className: classes.numberInput,
      }}
      {...props}
      value={stringValue}
    />
  )
}
