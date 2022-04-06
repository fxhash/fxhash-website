import style from "./InputReserve.module.scss"
import text from "../../../styles/Text.module.css"
import cs, { Value } from "classnames"
import { EReserveMethod, IReserve } from "../../../types/entities/Reserve"
import { FunctionComponent, PropsWithChildren, useMemo } from "react"
import { InputProps } from "../../../types/Inputs"
import { InputReserveWhitelist } from "./InputReserveWhitelist"
import { mapReserveDefinition } from "../../../utils/generative-token"
import { Field } from "../../Form/Field"
import { InputText } from "../InputText"
import { SliderWithText } from "../SliderWithText"
import { InputSplits } from "../InputSplits"
import { Button } from "../../Button"
import { ButtonDelete } from "../../Button/ButtonDelete"
import { Spacing } from "../../Layout/Spacing"


// the type of a reserve input update component
export type TInputReserveProps<T> = PropsWithChildren<InputProps<T>>
export type TInputReserve<T = any> = FunctionComponent<TInputReserveProps<T>>

// maps a reserve method to the component to edit it
const InputReserveByMethod: Record<EReserveMethod, TInputReserve> = {
  WHITELIST: InputReserveWhitelist
}

interface Props extends InputProps<IReserve<string>> {
  maxSize: number
  onRemove: () => void
}
export function InputReserve({
  value,
  onChange,
  maxSize,
  onRemove,
}: Props) {
  // grab definition of the reserve
  const definition = useMemo(
    () => mapReserveDefinition[value.method]
  , [value.method])

  const update = (key: keyof IReserve, val: any) => {
    onChange({
      ...value,
      [key]: val,
    })
  }

  return (
    <div className={cs(style.reserve)}>
      <header>
        <div>
          <h6>{definition.label}</h6>
          <span className={cs(text.info)}>{definition.description}</span>
        </div>
        <ButtonDelete
          className={cs(style.btn_delete)}
          onClick={onRemove}
        >
          remove
        </ButtonDelete>
      </header>
      <main>
        <definition.inputComponent
          value={value.data}
          onChange={val => update("data", val)}
        >
          <Field>
            <strong>Amount</strong>
            <Spacing size="8px"/>
            <SliderWithText
              value={parseInt(value.amount)}
              onChange={val => update("amount", val)}
              min={0}
              max={maxSize}
              step={1}
              textTransform={v => v.toFixed(0)}
              unit="eds"
            />
          </Field>
          <Spacing size="regular"/>
          <strong>Content</strong>
          <Spacing size="8px"/>
        </definition.inputComponent>
      </main>
    </div>
  )
}