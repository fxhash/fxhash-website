import {
  constrainRange,
  Controller,
  PointerHandler,
  PointerHandlerEvent,
  Value,
  ViewProps,
  ValueMap,
  Parser,
} from "@tweakpane/core"

import { FxStringInputView, TextProps } from "./view"

export interface Config {
  props: TextProps<string>
  parser: Parser<string>
  value: Value<string>
  viewProps: ViewProps
}
// Custom controller class should implement `Controller` interface
export class FxStringInputController implements Controller<FxStringInputView> {
  public readonly value: Value<string>
  public readonly view: FxStringInputView
  public readonly viewProps: ViewProps
  private readonly parser_: Parser<string>
  public readonly props: TextProps<string>

  constructor(doc: Document, config: Config) {
    this.onInputChange_ = this.onInputChange_.bind(this)

    this.parser_ = config.parser
    this.props = config.props
    this.value = config.value
    this.viewProps = config.viewProps
    this.view = new FxStringInputView(doc, {
      props: config.props,
      value: this.value,
      viewProps: this.viewProps,
    })
    this.view.inputElement.addEventListener("change", this.onInputChange_)
  }

  private onInputChange_(e: Event): void {
    const inputElem: HTMLInputElement = e.currentTarget as HTMLInputElement
    const value = inputElem.value

    const parsedValue = this.parser_(value)
    if (parsedValue) this.value.rawValue = parsedValue
    this.view.refresh()
  }
}
