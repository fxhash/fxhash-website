import style from "./InputRadioBtnIcon.module.scss"
import cs from "classnames"
import { ReactNode } from "react"
import { InputRadioButtons, Props as PropsInpRadBtn } from "./InputRadioButtons"

interface IOptProps {
  icon: ReactNode
}

interface Props extends Omit<PropsInpRadBtn<any, IOptProps>, "children"> {}

/**
 * A wrapper arround the InputRadioButton component to render the
 */
export function InputRadioBtnIcon(props: Props) {
  return (
    <InputRadioButtons {...props} layout="group" btnClassname={style.button}>
      {({ option, active }) => (
        <div
          className={cs(style.item, {
            [style.active]: active,
          })}
        >
          {option.optProps.icon}
          {option.label}
        </div>
      )}
    </InputRadioButtons>
  )
}
