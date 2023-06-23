import { useState, useEffect, useRef, ChangeEvent, useMemo } from "react"
import { hexToRgba, rgbaToHex } from "../utils"
import {
  FxParamControllerProps,
  Controller,
  BaseParamsInput,
} from "./Controller"
import classes from "./Color.module.scss"
import { RgbaColor, RgbaColorPicker } from "react-colorful"
import cx from "classnames"
import { BaseButton } from "../BaseInput"

export function ColorController(props: FxParamControllerProps<"color">) {
  const ref = useRef<HTMLDivElement>(null)
  const { label, id, onChange, value, layout = "box", isCodeDriven } = props
  const [showPicker, setShowPicker] = useState(false)
  const handleToggleShowPicker = () => {
    setShowPicker((show) => !show)
  }
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value)
  }
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current?.contains(event.target as Node)) {
        setShowPicker(false)
      }
    }
    window.addEventListener("mousedown", handleClickOutside)
    return () => {
      window.removeEventListener("mousedown", handleClickOutside)
    }
  }, [ref])
  const handleChangeColor = (newColor: RgbaColor) => {
    onChange(rgbaToHex(newColor.r, newColor.g, newColor.b, newColor.a))
  }
  const color = useMemo(() => hexToRgba(value), [value])

  // value to which "#" is added just in case missing, ensuring compatibility
  const colorHex = useMemo(
    () => (value.includes("#") ? value : `#${value}`),
    [value]
  )

  return (
    <Controller
      id={id}
      label={label}
      layout={layout}
      className={classes.pickerWrapper}
      inputContainerProps={{ ref }}
      isCodeDriven={isCodeDriven}
    >
      <BaseButton
        className={cx(classes.squaredButton, { [classes.active]: showPicker })}
        onClick={handleToggleShowPicker}
        disabled={isCodeDriven}
      >
        <div
          className={cx(classes.square, classes.leftTop)}
          style={{
            background: `linear-gradient(-45deg, ${colorHex} 0%, ${colorHex} 50%, ${colorHex.slice(
              0,
              7
            )} 50%, ${colorHex.slice(0, 7)} 100%)`,
          }}
        />
      </BaseButton>
      <BaseParamsInput
        type="text"
        id={`text-${id}`}
        onChange={handleInputChange}
        value={colorHex}
        autoComplete="off"
        maxLength={9}
        minLength={2}
        disabled={isCodeDriven}
      />
      {showPicker && (
        <div className={classes.pickerAbsoluteWrapper}>
          <div className={classes.picker}>
            <RgbaColorPicker
              color={color}
              onChange={handleChangeColor}
              className={classes.colorful}
            />
          </div>
        </div>
      )}
    </Controller>
  )
}
