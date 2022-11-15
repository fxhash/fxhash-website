import {
  mapRange,
  Value,
  View,
  ViewProps,
  ClassName,
  ValueMap,
} from "@tweakpane/core"
import style from "./style.module.scss"

export type TextProps<T> = ValueMap<{
  view: "string"
  maxLength?: number
  minLength?: number
}>

interface Config {
  props: TextProps<string>
  value: Value<string>
  viewProps: ViewProps
}

const className = ClassName("txt")

// Custom view class should implement `View` interface
export class FxStringInputView implements View {
  public readonly inputElement: HTMLInputElement
  public readonly element: HTMLElement
  private value_: Value<string>
  private readonly props_: TextProps<string>
  constructor(doc: Document, config: Config) {
    this.onChange_ = this.onChange_.bind(this)

    this.element = doc.createElement("div")
    this.element.classList.add(className())
    config.viewProps.bindClassModifiers(this.element)

    this.props_ = config.props
    this.props_.emitter.on("change", this.onChange_)

    const inputElem = doc.createElement("input")
    inputElem.classList.add(className("i"), style.input)
    inputElem.type = "text"
    config.viewProps.bindDisabled(inputElem)
    this.element.appendChild(inputElem)
    this.inputElement = inputElem
    config.value.emitter.on("change", this.onChange_)
    this.value_ = config.value

    this.refresh()
  }

  public refresh(): void {
    const minLength = this.props_.get("minLength") || 0
    const maxLength = this.props_.get("maxLength") || 524288

    this.inputElement.minLength = minLength
    this.inputElement.maxLength = maxLength
    this.inputElement.value = this.value_.rawValue.substr(0, maxLength)
  }

  private onChange_(): void {
    this.refresh()
  }
}
