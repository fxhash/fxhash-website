import style from "./Slider.module.scss"
import cs from "classnames"
import { Props as SliderProps, Slider } from "./Slider"
import { InputText } from "./InputText"


interface Props extends SliderProps {
  unit?: string
  textTransform?: (value: number) => string
}

export function SliderWithTextInput({
  unit = "s",
  textTransform = (val) => val.toFixed(1),
  ...props
}: Props) {
  return (
    <div className={cs(style.withtext)}>
      <Slider {...props}/>
      <InputText
        value={props.value}
        className={cs(style.input_text)}
        onChange={evt => props.onChange(evt.target.value as any)}
      />
    </div>
  )
}