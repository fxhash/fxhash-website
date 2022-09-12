import style from "./ProgressModule.module.scss"
import cs from "classnames"
import { ProgressEntry } from "./ProgressEntry"
import { clamp } from "../../../utils/math"
import { useMemo } from "react"


function cursorProgress(position: number, size: number) {
  return clamp((1/size) * (0.5 + position), 0, 1)
}

interface Props {
  entries: string[]
  position: number
}

export function ProgressModule({
  entries,
  position
}: Props) {
  // compute the loading value based on the number of entries / current position
  const [validPos, loadingPos] = useMemo(() => {
    return [
      cursorProgress(position-1, entries.length),
      cursorProgress(position, entries.length),
    ]
  }, [entries.length, position])

  return (
    <div className={cs(style.container)}>
      <div className={cs(style.progress)}>
        <div
          className={cs(style.progress_valid)}
          style={{
            height: `${validPos*100}%`
          }}
        />
        <div
          className={cs(style.progress_loading)}
          style={{
            height: `${loadingPos*100}%`
          }}
        />
      </div>
      {entries.map((entry, idx) => (
        <ProgressEntry
          key={idx}
          state={idx === position ? "loading" : (idx > position ? "default" : "success")}
        >
          { entry }
        </ProgressEntry>
      ))}
    </div>
  )
}
