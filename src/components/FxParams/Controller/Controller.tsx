import {
  HTMLInputTypeAttribute,
  InputHTMLAttributes,
  ReactNode,
  RefObject,
} from "react"
import { FxParamOptionsMap, FxParamType } from "../types"
import classes from "./Controller.module.scss"
import cx from "classnames"
import { BaseInput } from "../BaseInput"

/*
 * Providing a name starting or ending with `search` prevents
 * 1Password extension to appear in the input fields
 * https://1password.community/discussion/comment/606453/#Comment_606453
 */
export function BaseParamsInput(props: InputHTMLAttributes<HTMLInputElement>) {
  const { id } = props
  return (
    <BaseInput name={`${id}-params-search`} autoComplete="off" {...props} />
  )
}

export type FxParamInputChangeHandler = (e: any) => void

export interface ControllerProps {
  label?: string
  id?: string
  children: ReactNode
  layout?: "default" | "invert" | "box"
  className?: string
  inputContainerProps?: {
    ref: RefObject<HTMLDivElement>
  }
}

export function Controller(props: ControllerProps) {
  const {
    id,
    label,
    layout = "default",
    className,
    inputContainerProps,
  } = props
  return (
    <div className={cx(classes.controller, classes[layout], className)}>
      {id && <label htmlFor={id}>{label || id}</label>}
      <div className={classes.inputContainer} {...inputContainerProps}>
        {props.children}
      </div>
    </div>
  )
}

export interface HTMLInputControllerProps {
  id: string
  value: string
  onChange: FxParamInputChangeHandler
  type: HTMLInputTypeAttribute
  inputProps?: InputHTMLAttributes<HTMLInputElement | HTMLSelectElement>
  className?: string
  label?: string
  layout?: "default" | "invert" | "box"
}

export type FxParamControllerProps<Type extends FxParamType> = Omit<
  HTMLInputControllerProps,
  "type"
> & {
  value: any
  options?: FxParamOptionsMap[Type]
  onChange: FxParamInputChangeHandler
}

export function HTMLInputController(props: HTMLInputControllerProps) {
  const {
    label,
    id,
    onChange,
    value,
    type,
    className,
    inputProps = {},
    layout = "default",
  } = props
  return (
    <Controller id={id} label={label} layout={layout}>
      <BaseParamsInput
        className={className}
        type={type}
        id={id}
        onChange={onChange}
        value={value}
        {...inputProps}
      />
    </Controller>
  )
}

export interface HTMLInputControllerWithTextInputProps
  extends HTMLInputControllerProps {
  textInputProps?: InputHTMLAttributes<HTMLInputElement>
}

export function HTMLInputControllerWithTextInput(
  props: HTMLInputControllerWithTextInputProps
) {
  const {
    label,
    id,
    onChange,
    value,
    type,
    className,
    inputProps = {},
    layout = "default",
    textInputProps,
  } = props
  return (
    <Controller id={id} label={label} layout={layout}>
      <BaseParamsInput
        className={className}
        type={type}
        id={id}
        onChange={onChange}
        value={value}
        autoComplete="off"
        {...inputProps}
      />
      <BaseParamsInput
        type="text"
        id={`text-${id}`}
        onChange={onChange}
        value={value}
        autoComplete="off"
        {...textInputProps}
      />
    </Controller>
  )
}
