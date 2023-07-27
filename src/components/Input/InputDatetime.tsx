import style from "./InputDatetime.module.scss"
import cs from "classnames"
import dynamic from "next/dynamic"
import "react-datepicker/dist/react-datepicker.css"
import { useState } from "react"
import { addMonths, startOfYesterday } from "date-fns"
import { InputProps } from "../../types/Inputs"
import { Button } from "../Button"

const DatePicker = dynamic(() => import("react-datepicker"))

export interface IInputDatetimeFastBtn {
  label: string
  generate: (current: Date) => Date
}

interface Props extends InputProps<Date> {
  error?: boolean
  fastBtns?: IInputDatetimeFastBtn[]
}
export function InputDatetime({ value, onChange, error, fastBtns }: Props) {
  const [startDate, setStartDate] = useState<Date | null>(new Date())

  return (
    <div className={cs(style.root)}>
      <DatePicker
        showTimeInput
        dateFormat="dd MMMM yyyy, HH:mm"
        selected={value}
        // @ts-ignore
        onChange={onChange}
        // @ts-ignore
        excludeDateIntervals={[
          {
            start: new Date(0),
            end: startOfYesterday(),
          },
        ]}
        className={cs({
          [style.error]: !!error,
        })}
      />
      {fastBtns?.map((btn, idx) => (
        <Button
          key={idx}
          size="small"
          type="button"
          onClick={() => onChange(btn.generate(value))}
        >
          {btn.label}
        </Button>
      ))}
    </div>
  )
}
