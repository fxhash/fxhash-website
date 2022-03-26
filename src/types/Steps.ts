import { FunctionComponent } from "react"
import { MintGenerativeData } from "./Mint"

export interface StepProps {
  state: MintGenerativeData
  onNext: (data: Partial<MintGenerativeData>) => void
  // validateIncoming: (data: MintGenerativeData) => boolean
  // onValidationFailed: () => void
}

export type StepComponent<T = {}> = FunctionComponent<StepProps & T>

export interface Step {
  component: StepComponent
  path: string
  title?: string
  hideTabs?: boolean
  // a list of the properties which the step must be set in the generative data
  // state before reaching the step. 
  // it will be used to validate current data & clear data down
  requiredProps: (keyof MintGenerativeData)[]
}