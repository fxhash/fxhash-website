import style from "./InputDatetime.module.scss"
import cs from "classnames"
import dynamic from "next/dynamic"
import "react-datepicker/dist/react-datepicker.css"
import { useState } from "react"
import { addMonths, startOfYesterday } from "date-fns"
import { InputProps } from "../../types/Inputs"


const DatePicker = dynamic(() => import("react-datepicker"))

interface Props extends InputProps<Date> {
  
}
export function InputDatetime({
  value,
  onChange,
}: Props) {
  const [startDate, setStartDate] = useState<Date|null>(new Date())

  return (
    <div className={cs(style.root)}>
      <DatePicker
        showTimeInput
        dateFormat="dd MMMM yyyy, HH:mm"
        selected={value}
        // @ts-ignore
        onChange={onChange}
        // @ts-ignore
        excludeDateIntervals={[{
          start: new Date(0),
          end: startOfYesterday(),
        }]}
      />
    </div>
  )
}