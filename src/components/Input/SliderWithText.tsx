import style from "./Slider.module.scss"
import cs from "classnames"
import { Props as SliderProps, Slider } from "./Slider"


interface Props extends SliderProps {
  unit?: string
}

export function SliderWithText({
  unit = "s",
  ...props
}: Props) {
  return (
    <div className={cs(style.withtext)}>
      <Slider {...props}/>
      <span className={cs(style.text)}>
        { props.value.toFixed(1) } { unit }
      </span>
    </div>
  )
}