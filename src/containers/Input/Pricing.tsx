// import style from "./Pricing.module.scss"
import cs from "classnames"
import { FormikErrors } from "formik"
import { Field } from "../../components/Form/Field"
import { Fieldset } from "../../components/Form/Fieldset"
import { InputRadioBtnIcon } from "../../components/Input/InputRadioBtnIcon"
import { RadioOption } from "../../components/Input/InputRadioButtons"
import { GenTokPricing } from "../../types/entities/GenerativeToken"
import { Collaboration } from "../../types/entities/User"
import { GenTokPricingForm } from "../../types/Mint"
import { InputPricingDutchAuction } from "./PricingDutchAuction"
import { InputPricingFixed } from "./PricingFixed"

const PricingOptions: RadioOption[] = [
  {
    value: GenTokPricing.FIXED,
    label: "Fixed price",
    optProps: {
      icon: <i aria-hidden className="fa-solid fa-equals" />,
    },
  },
  {
    value: GenTokPricing.DUTCH_AUCTION,
    label: "Dutch auction",
    optProps: {
      icon: <i aria-hidden className="fa-solid fa-arrow-down-right" />,
    },
  },
]

interface Props {
  value: GenTokPricingForm<string>
  onChange: (value: GenTokPricingForm<string>) => void
  errors?: FormikErrors<GenTokPricingForm<string>>
  lockWarning?: boolean
  collaboration?: Collaboration | null
}
export function InputPricing({
  value,
  onChange,
  errors,
  lockWarning,
  collaboration,
}: Props) {
  const update = (key: keyof GenTokPricingForm<string>, nvalue: any) => {
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
          <small>
            You will be able to update the pricing method after publication
          </small>
        </label>
        <InputRadioBtnIcon
          value={value.pricingMethod}
          onChange={(val) => update("pricingMethod", val)}
          options={PricingOptions}
        />
      </Field>

      {value.pricingMethod === GenTokPricing.FIXED && (
        <InputPricingFixed
          value={value.pricingFixed}
          onChange={(v) => update("pricingFixed", v)}
          errors={errors?.pricingFixed}
          lockWarning={lockWarning}
          collaboration={collaboration}
        />
      )}

      {value.pricingMethod === GenTokPricing.DUTCH_AUCTION && (
        <InputPricingDutchAuction
          value={value.pricingDutchAuction}
          onChange={(v) => update("pricingDutchAuction", v)}
          errors={errors?.pricingDutchAuction}
          lockWarning={lockWarning}
          collaboration={collaboration}
        />
      )}
    </Fieldset>
  )
}
