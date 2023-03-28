import {
  useState,
  useEffect,
  useRef,
  LegacyRef,
  MutableRefObject,
  RefObject,
  ChangeEvent,
  useMemo,
} from "react"
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
  const { label, id, onChange, value, layout = "box" } = props
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

  return (
    <Controller
      id={id}
      label={label}
      layout={layout}
      className={classes.pickerWrapper}
      inputContainerProps={{ ref }}
    >
      <BaseButton
        className={cx(classes.squaredButton, { [classes.active]: showPicker })}
        onClick={handleToggleShowPicker}
      >
        <div
          className={cx(classes.square, classes.leftTop)}
          style={{
            background: `linear-gradient(-45deg, ${value} 0%, ${value} 50%, ${value.slice(
              0,
              7
            )} 50%, ${value.slice(0, 7)} 100%)`,
          }}
        />
      </BaseButton>
      <BaseParamsInput
        type="text"
        id={`text-${id}`}
        onChange={handleInputChange}
        value={value}
        autoComplete="off"
        maxLength={9}
        minLength={2}
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
