import style from "./InputDatetime.module.scss"
import cs from "classnames"
import dynamic from "next/dynamic"
import "react-datepicker/dist/react-datepicker.css"
import { useState } from "react"
import { addMonths, startOfYesterday } from "date-fns"

const Datepicker = dynamic(() => import("react-datepicker"))


interface Props {
  
}
export function InputDatetime({
  
}: Props) {
  const [startDate, setStartDate] = useState<Date|null>(new Date())

  return (
    <div className={cs(style.root)}>
      <Datepicker
        showTimeInput
        dateFormat="dd MMMM yyyy, HH:mm"
        selected={startDate}
        // @ts-ignore
        onChange={setStartDate}
        // @ts-ignore
        excludeDateIntervals={[{
          start: new Date(0),
          end: startOfYesterday(),
        }]}
      />
    </div>
  )
}