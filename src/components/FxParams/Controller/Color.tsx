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
  const [scrollOffset, setScrollOffset] = useState(0)
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

  useEffect(() => {
    if (!ref.current) return
    const findScrollingParent = (node: HTMLElement): HTMLElement | null => {
      if (node.scrollHeight > node.clientHeight) return node
      return findScrollingParent(
        (node?.parentNode as HTMLElement) || document.body
      )
    }
    const scrollingParent = findScrollingParent(ref.current)
    if (!scrollingParent) return
    const handleScroll = (e: Event) => {
      const { scrollTop } = e.target as HTMLElement
      if (scrollTop === scrollOffset) return
      setScrollOffset(scrollTop)
    }
    scrollingParent.addEventListener("scroll", handleScroll)
    return () => scrollingParent.removeEventListener("scroll", handleScroll)
  }, [ref, scrollOffset])

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
        <div className={cx(classes.square)} style={{ background: value }} />
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
          <div
            className={classes.picker}
            style={{ transform: `translate(0px, -${scrollOffset}px)` }}
          >
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
