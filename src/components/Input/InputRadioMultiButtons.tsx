import style from "./InputRadioButtons.module.scss"
import cs from "classnames"
import { FunctionComponent } from "react"
import { arrayRemove } from "utils/array"

type TLayout = "default" | "fixed-size" | "group"

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
  value: T[]
  onChange: (value: T[]) => void
  options: RadioOption<T, OptProps>[]
  layout?: TLayout
  className?: string
  btnClassname?: string
  children?: FunctionComponent<PropsOptionRenderer<T>>
}
export function InputRadioMultiButtons<T = any, OptProps = any>({
  value,
  onChange,
  options,
  layout = "default",
  className,
  btnClassname,
  children = OptionRendererDefault,
}: Props<T, OptProps>) {
  const toggle = (v: T) => {
    if (!value.includes(v)) {
      onChange([...value, v])
    } else {
      const out = [...value]
      arrayRemove(out, v)
      onChange(out)
    }
  }

  return (
    <div className={cs(style.root, className, style[`layout_${layout}`])}>
      {options.map((option) => {
        const active = value.includes(option.value)
        return (
          <button
            key={option.value ?? ("undefined" as any)}
            type="button"
            className={cs(
              {
                [style.active]: active,
              },
              style.button,
              btnClassname
            )}
            onClick={() => toggle(option.value)}
          >
            {children({
              option,
              active: active,
            })}
          </button>
        )
      })}
    </div>
  )
}
