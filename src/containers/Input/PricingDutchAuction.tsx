import style from "./Pricing.module.scss"
import text from "../../styles/Text.module.css"
import layout from "../../styles/Layout.module.scss"
import cs from "classnames"
import { IInputDatetimeFastBtn, InputDatetime } from "../../components/Input/InputDatetime"
import { IPricingDutchAuction } from "../../types/entities/Pricing"
import { InputProps } from "../../types/Inputs"
import { InputTextUnit } from "../../components/Input/InputTextUnit"
import { FocusEventHandler } from "react"
import { Field } from "../../components/Form/Field"
import { ButtonDelete } from "../../components/Button/ButtonDelete"
import { Button } from "../../components/Button"
import { FormikErrors } from "formik"
import { addHours, startOfHour } from "date-fns"


const dutchAucDateFast: IInputDatetimeFastBtn[] = [
  {
    label: "end of next hour",
    generate: () => addHours(startOfHour(new Date()), 2)
  },
  {
    label: "+1h",
    generate: (date) => date ? addHours(date, 1) : addHours(new Date(), 1)
  },
  {
    label: "-1h",
    generate: (date) => date ? addHours(date, -1) : addHours(new Date(), -1)
  },
]

interface Props extends InputProps<Partial<IPricingDutchAuction<string>>> {
  onBlur?: FocusEventHandler<HTMLInputElement>
  errors?: FormikErrors<IPricingDutchAuction>
}
export function InputPricingDutchAuction({
  value,
  onChange,
  onBlur,
  errors,
}: Props) {

  const update = (key: keyof IPricingDutchAuction, nval: any) => {
    onChange({
      ...value,
      [key]: nval,
    })
  }

  return (
    <>
      <Field error={
        (typeof errors?.levels === "string") ? errors.levels : undefined}
      >
        <label htmlFor="price">
          Price steps
          <small>
            In descending order
          </small>
        </label>

        <div className={cs(style.levels)}>
          <Button
            size="small"
            type="button"
            color="transparent"
            iconComp={<i aria-hidden className="fa-solid fa-circle-plus"/>}
            onClick={() => {
              const levels = value.levels!
              let V = 50
              if (levels?.length >= 1) {
                V = Math.floor(parseFloat(levels[0])*2)
              }
              update("levels", levels ? [V, ...levels] : [V])
            }}
          >
            add
          </Button>

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
                error={
                  !(typeof errors?.levels === "string") && !!errors?.levels?.[idx]
                }
              />
              <ButtonDelete
                onClick={() => {
                  if (value.levels!.length > 2) {
                    const nlevels = [...value.levels!]
                    nlevels.splice(idx, 1)
                    update("levels", nlevels)
                  }
                }}
                disabled={value.levels!.length <= 2}
              />
              {errors?.levels && !(typeof errors.levels === "string") && errors.levels[idx] && (
                <span className={cs(style.error)}>
                  {errors.levels[idx]}
                </span>
              )}
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
                V = Math.floor(parseFloat(levels[levels.length-1])*50) / 100
              }
              update("levels", levels ? [...levels, V] : [V])
            }}
          >
            add
          </Button>
        </div>
      </Field>

      <Field error={errors?.opensAt}>
        <label>
          Opening time
          <small>In your local timezone</small>
        </label>
        <InputDatetime
          value={value.opensAt!}
          onChange={val => update("opensAt", val)}
          error={!!errors?.opensAt}
          fastBtns={dutchAucDateFast}
        />
      </Field>

      <Field error={errors?.decrementDuration}>
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
          error={!!errors?.decrementDuration}
        />
      </Field>
    </>
  )
}