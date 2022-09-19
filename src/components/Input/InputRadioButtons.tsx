import style from "./InputRadioButtons.module.scss"
import cs from "classnames"
import { FunctionComponent } from "react"

type TLayout = "default" | "fixed-size"

export interface RadioOption<T = any, OptProps = any> {
  value: T
  label: string
  optProps?: OptProps
}

interface PropsOptionRenderer<T = any, OptProps = any> {
  option: RadioOption<T, OptProps>
  active: boolean
}
function OptionRendererDefault({ option, active }: PropsOptionRenderer) {
  return (
    <div className={cs(style.opt_default_renderer_root)}>{option.label}</div>
  )
}

export interface Props<T = any, OptProps = any> {
  value: T
  onChange: (value: T) => void
  options: RadioOption<T, OptProps>[]
  layout?: TLayout
  className?: string
  children?: FunctionComponent<PropsOptionRenderer<T>>
}
export function InputRadioButtons<T = any, OptProps = any>({
  value,
  onChange,
  options,
  layout = "default",
  className,
  children = OptionRendererDefault,
}: Props<T, OptProps>) {
  return (
    <div className={cs(style.root, className, style[`layout_${layout}`])}>
      {options.map((option) => (
        <button
          key={option.value ?? ("undefined" as any)}
          type="button"
          className={cs({
            [style.active]: option.value === value,
          })}
          onClick={() => option.value !== value && onChange(option.value)}
        >
          {children({
            option,
            active: option.value === value,
          })}
        </button>
      ))}
    </div>
  )
}
