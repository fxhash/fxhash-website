import style from "./Slider.module.scss"
import cs from "classnames"
import { Props as SliderProps, Slider } from "./Slider"


interface Props extends SliderProps {
  unit?: string
  textTransform?: (value: number) => string
}

export function SliderWithText({
  unit = "s",
  textTransform = (val) => val.toFixed(1),
  ...props
}: Props) {
  return (
    <div className={cs(style.withtext)}>
      <Slider {...props}/>
      <span className={cs(style.text)}>
        { textTransform(props.value) } { unit }
      </span>
    </div>
  )
}