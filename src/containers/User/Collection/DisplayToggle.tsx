import React, { memo, useCallback } from "react"
import { InputMultiIcons } from "../../../components/Input/InputMultiIcons"
import style from "./DisplayToggle.module.scss"

const options = [
  {
    label: (
      <i
        aria-hidden="false"
        title="Display as grid"
        className="fa-sharp fa-solid fa-grid-2"
      />
    ),
    value: "grid",
  },
  {
    label: (
      <i
        className="fa-sharp fa-solid fa-bars"
        aria-hidden="false"
        title="Display as list"
      />
    ),
    value: "list",
  },
]

type DisplayMode = "list" | "grid"
interface DisplayToggleProps {
  onChange: (displayMode: DisplayMode) => void
  value: DisplayMode
}

const _DisplayToggle = ({ onChange, value }: DisplayToggleProps) => {
  const handleChange = useCallback(
    (opt) => {
      onChange(opt.value)
    },
    [onChange]
  )
  return (
    <InputMultiIcons
      className={style.display}
      onChange={handleChange}
      value={value}
      options={options}
    />
  )
}

export const DisplayToggle = memo(_DisplayToggle)
