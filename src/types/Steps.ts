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
  // needs to be called when component mounts, to check if it can process to next step
  validateIn: (data: MintGenerativeData) => boolean
  // needs to be called after validation IN, to clear eventual data down the state
  clearDataDown: (data: MintGenerativeData) => MintGenerativeData
}