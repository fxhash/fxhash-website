import { useState } from "react"
import { IValidationOutput, TValidationFunction } from "../utils/validation/validation"

export interface IValidationHook<InputType> {
  errors?: string[]
  validate: () => boolean
}

/**
 * A deferrer validation hook which updates the state only when the `validate`
 * function is called. Before triggering an event, the validate function should
 * be called and it will pass the input to the validation function.
 * 
 * ```js
 * const [input, setInput] = useState("something...")
 * const { errors, validate } = useValidation(input, validationFunction)
 * 
 * const doSomething = () => {
 *    if (validate()) {
 *      // trigger some operation
 *    }
 * }
 * ```
 * 
 * @param input the input to be validated
 * @param validationFn the validation function
 */
export function useValidate<InputType>(
  input: InputType,
  validationFn: TValidationFunction<InputType>
): IValidationHook<InputType> {
  const [errors, setErrors] = useState<string[]>()

  const validate = () => {
    const { valid, errors } = validationFn(input)
    setErrors(errors)
    return valid
  }

  return {
    errors,
    validate,
  }
}