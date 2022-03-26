// import style from "./Pricing.module.scss"
import cs from "classnames"
import { FormikErrors } from "formik"
import { useState } from "react"
import { Field } from "../../components/Form/Field"
import { Fieldset } from "../../components/Form/Fieldset"
import { IOptions, Select } from "../../components/Input/Select"
import { GenTokPricing } from "../../types/entities/GenerativeToken"
import { GenTokPricingForm } from "../../types/Mint"
import { InputPricingDutchAuction } from "./PricingDutchAuction"
import { InputPricingFixed } from "./PricingFixed"


const PricingOptions: IOptions[] = [
  {
    label: "Fixed price",
    value: GenTokPricing.FIXED,
  },
  {
    label: "Dutch auction",
    value: GenTokPricing.DUTCH_AUCTION,
  },
]

interface Props {
  value: GenTokPricingForm
  onChange: (value: GenTokPricingForm) => void
  errors?: FormikErrors<GenTokPricingForm>
}
export function InputPricing({
  value,
  onChange,
  errors,
}: Props) {

  console.log({ value, errors })

  const update = (key: keyof GenTokPricingForm, nvalue: any) => {
    onChange({
      ...value,
      [key]: nvalue,
    })
  }

  return (
    <Fieldset>
      <Field>
        <label>
          Pricing method
          <small>You will not be able to update the pricing method after publication, only its pricing settings</small>
        </label>
        <Select
          options={PricingOptions}
          value={value.pricingMethod ?? ""}
          onChange={val => update("pricingMethod", val)}
          placeholder="Select a pricing method"
        />
      </Field>

      {value.pricingMethod === GenTokPricing.FIXED && (
        <InputPricingFixed
          value={value.pricingFixed}
          onChange={v => update("pricingFixed", v)}
          errors={errors?.pricingFixed}
        />
      )}

      {value.pricingMethod === GenTokPricing.DUTCH_AUCTION && (
        <InputPricingDutchAuction
          value={value.pricingDutchAuction}
          onChange={v => update("pricingDutchAuction", v)}
          errors={errors?.pricingDutchAuction}
        />
      )}
    </Fieldset>
  )
}