import style from "./Pricing.module.scss"
import text from "../../styles/Text.module.css"
import layout from "../../styles/Layout.module.scss"
import cs from "classnames"
import { InputDatetime } from "../../components/Input/InputDatetime"
import { IPricingDutchAuction } from "../../types/entities/Pricing"
import { InputProps } from "../../types/Inputs"
import { InputTextUnit } from "../../components/Input/InputTextUnit"
import { FocusEventHandler } from "react"
import { Field } from "../../components/Form/Field"
import { Checkbox } from "../../components/Input/Checkbox"
import { Spacing } from "../../components/Layout/Spacing"
import { addHours, startOfHour } from "date-fns"
import { ButtonDelete } from "../../components/Button/ButtonDelete"
import { Button } from "../../components/Button"

interface Props extends InputProps<Partial<IPricingDutchAuction>> {
  onBlur?: FocusEventHandler<HTMLInputElement>
}
export function InputPricingDutchAuction({
  value,
  onChange,
  onBlur,
}: Props) {

  const update = (key: keyof IPricingDutchAuction, nval: any) => {
    onChange({
      ...value,
      [key]: nval,
    })
  }

  return (
    <>
      <Field /*error={errors.price}*/ >
        <label htmlFor="price">
          Price steps
          <small>
            In descending order
          </small>
        </label>

        <div className={cs(style.levels)}>
          {value.levels?.map((price, idx) => (
            <div
              key={idx}
              className={cs(layout.flex_row)}
            >
              <InputTextUnit
                unit="tez"
                type="text"
                name="price"
                value={price}
                onChange={evt => {
                  const nlevels = [...value.levels!]
                  nlevels[idx] = evt.target.value as any
                  update("levels", nlevels)
                }}
                // onBlur={onBlur}
                // error={!!errors.price}
              />
              <ButtonDelete
                onClick={() => {
                  const nlevels = [...value.levels!]
                  nlevels.splice(idx, 1)
                  update("levels", nlevels)
                }}
              />
            </div>
          ))}

          <Button
            size="small"
            type="button"
            color="transparent"
            iconComp={<i aria-hidden className="fa-solid fa-circle-plus"/>}
            onClick={() => {
              const levels = value.levels!
              let V = 50
              if (levels?.length >= 1) {
                V = Math.floor(levels[levels.length-1]*.5)
              }
              update("levels", levels ? [...levels, V] : [V])
            }}
          >
            add
          </Button>
        </div>
      </Field>

      <Field>
        <label>
          Opening time
          <small>In your local timezone</small>
        </label>
        <InputDatetime
          value={value.opensAt!}
          onChange={val => update("opensAt", val)}
        />
      </Field>

      <Field /*error={errors.price}*/ >
        <label htmlFor="price">
          Time between steps
        </label>
        <InputTextUnit
          unit="minutes"
          type="text"
          name="price"
          value={value?.decrementDuration ?? ""}
          onChange={evt => update("decrementDuration", evt.target.value)}
          // onBlur={onBlur}
          // error={!!errors.price}
        />
      </Field>
    </>
  )
}