export interface IValidationOutput {
  valid: boolean
  errors?: string[]
}

export type TValidationFunction<InputType> = (input: InputType) => IValidationOutput