import { FxParamControllerProps, HTMLInputController } from "./Controller"

export function StringController(props: FxParamControllerProps<"string">) {
  const { options } = props
  const minLength = Number(options?.minLength) || undefined
  const maxLength = Number(options?.maxLength) || undefined

  return (
    <HTMLInputController
      type="text"
      inputProps={{ minLength, maxLength }}
      {...props}
    />
  )
}
