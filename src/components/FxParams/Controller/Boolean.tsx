import { FxParamControllerProps, HTMLInputController } from "./Controller"
import classes from "./Controller.module.scss"

export function BooleanController(props: FxParamControllerProps<"boolean">) {
  return (
    <HTMLInputController
      type="checkbox"
      layout="box"
      inputProps={{ checked: props.value }}
      {...props}
    />
  )
}
