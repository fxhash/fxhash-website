import style from "./InputReserve.module.scss"
import text from "../../../styles/Text.module.css"
import cs from "classnames"
import { IReserve } from "../../../types/entities/Reserve"
import { FunctionComponent, PropsWithChildren, useMemo } from "react"
import { InputProps } from "../../../types/Inputs"
import { mapReserveDefinition } from "../../../utils/generative-token"
import { Field } from "../../Form/Field"
import { SliderWithText } from "../SliderWithText"
import { ButtonDelete } from "../../Button/ButtonDelete"
import { Spacing } from "../../Layout/Spacing"
import { FormikErrors } from "formik"

// the type of a reserve input update component
export interface TInputReserveProps<T>
  extends PropsWithChildren<InputProps<T>> {
  maxSize: number
  errors?: FormikErrors<T>
}
export type TInputReserve<T = any> = FunctionComponent<TInputReserveProps<T>>

interface Props extends InputProps<IReserve<string>> {
  maxSize: number
  onRemove: () => void
  errors?: FormikErrors<IReserve>
}
export function InputReserve({
  value,
  onChange,
  maxSize,
  onRemove,
  errors,
}: Props) {
  // grab definition of the reserve
  const definition = useMemo(
    () => mapReserveDefinition[value.method],
    [value.method]
  )

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
        <ButtonDelete className={cs(style.btn_delete)} onClick={onRemove}>
          remove
        </ButtonDelete>
      </header>
      <main>
        <definition.inputComponent
          maxSize={maxSize}
          value={value.data}
          onChange={(val) => update("data", val)}
          errors={
            (typeof errors?.data !== "string" ? errors?.data : undefined) as any
          }
        >
          <Field error={errors?.amount}>
            <strong>Amount</strong>
            <Spacing size="8px" />
            <SliderWithText
              value={parseInt(value.amount)}
              onChange={(val) => update("amount", val)}
              min={0}
              max={maxSize}
              step={1}
              textTransform={(v) => v.toFixed(0)}
              unit="eds"
            />
          </Field>
          <Spacing size="regular" />
          <Field
            error={typeof errors?.data === "string" ? errors.data : undefined}
          >
            <strong>Content</strong>
          </Field>
          <Spacing size="8px" />
        </definition.inputComponent>
      </main>
    </div>
  )
}
