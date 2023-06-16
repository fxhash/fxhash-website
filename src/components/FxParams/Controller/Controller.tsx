import {
  HTMLInputTypeAttribute,
  InputHTMLAttributes,
  ReactNode,
  RefObject,
  useCallback,
  useState,
} from "react"
import { FxParamOptionsMap, FxParamType, FxParamTypeMap } from "../types"
import classes from "./Controller.module.scss"
import cx from "classnames"
import { BaseInput } from "../BaseInput"
import cs from "classnames"

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

export type FxParamInputChangeHandler<Type extends FxParamType = any> = (
  e: any
) => FxParamTypeMap[Type]

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
  const [labelEllipsis, setLabelEllipsis] = useState(true)
  const {
    id,
    label,
    layout = "default",
    className,
    inputContainerProps,
  } = props
  const handleToggleEllipsis = useCallback(
    () => setLabelEllipsis((old) => !old),
    []
  )
  return (
    <div className={cx(classes.controller, classes[layout], className)}>
      {id && (
        <label
          className={cs({
            [classes.ellipsis]: labelEllipsis,
          })}
          title={label}
          htmlFor={id}
          onClick={handleToggleEllipsis}
        >
          {label || id}
        </label>
      )}
      <div className={classes.inputContainer} {...inputContainerProps}>
        {props.children}
      </div>
    </div>
  )
}

export interface HTMLInputControllerProps {
  id: string
  value: string
  onChange: (value: any) => void
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
  onChange: (value: any) => void
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
