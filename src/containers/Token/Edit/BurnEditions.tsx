import style from "./EditStyle.module.scss"
import layout from "../../../styles/Layout.module.scss"
import cs from "classnames"
import { GenerativeToken, GenTokPricing } from "../../../types/entities/GenerativeToken"
import { Formik } from "formik"
import { Form } from "../../../components/Form/Form"
import { Fieldset } from "../../../components/Form/Fieldset"
import { Field } from "../../../components/Form/Field"
import { Checkbox } from "../../../components/Input/Checkbox"
import { Spacing } from "../../../components/Layout/Spacing"
import { InputTextUnit } from "../../../components/Input/InputTextUnit"
import { InputSplits } from "../../../components/Input/InputSplits"
import { transformSplitsSum1000 } from "../../../utils/transformers/splits"
import { FxhashContracts } from "../../../types/Contracts"
import { Button } from "../../../components/Button"
import { useContractOperation } from "../../../hooks/useContractOperation"
import { UpdateIssuerOperation } from "../../../services/contract-operations/UpdateIssuer"
import { UpdateIssuerForm } from "../../../types/UpdateIssuer"
import { ContractFeedback } from "../../../components/Feedback/ContractFeedback"
import { InputPricingFixed } from "../../Input/PricingFixed"
import { transformPricingDutchNumbersToString, transformPricingFixedNumbersToString } from "../../../utils/transformers/pricing"
import { InputPricingDutchAuction } from "../../Input/PricingDutchAuction"
import { UpdatePricingOperation } from "../../../services/contract-operations/UpdatePricing"
import { SliderWithTextInput } from "../../../components/Input/SliderWithTextInput"
import { FormEventHandler, useState } from "react"
import { BurnSupplyOperation } from "../../../services/contract-operations/BurnSupply"


interface Props {
  token: GenerativeToken
}
export function BurnEditions({
  token,
}: Props) {

  const {
    call,
    loading,
    error,
    success,
    state,
  } = useContractOperation(BurnSupplyOperation)

  const [editions, setEditions] = useState<number>(0)

  const disabled = token.balance === 0

  const update: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault()
    call({
      supply: editions,
      token: token,
    })
  }
  
  return (
    <Form
      onSubmit={update}
    >
      <Fieldset
        className={cs({
          [style.disabled]: disabled
        })}
      >
        <h4>Burn editions</h4>
        <Spacing size="large"/>

        {disabled && (
          <>
            <span className={cs(style.disabled_message)}>
              You cannot burn editions once minting is completed.
            </span>
            <Spacing size="large"/>
          </>
        )}

        <Field>
          <label htmlFor="price">
            Number of editions to burn
          </label>
          <SliderWithTextInput
            min={0}
            max={token.balance}
            step={1}
            value={editions}
            onChange={setEditions}
            textTransform={val => val.toFixed(0)}
            unit=""
          />
        </Field>

        <Spacing size="3x-large"/>
        
        <div className={cs(layout.y_centered)}>
          <ContractFeedback
            state={state}
            loading={loading}
            success={success}
            error={error}
          />
          <Button
            type="submit"
            size="regular"
            color="primary"
            disabled={disabled || editions === 0}
            state={loading ? "loading" : "default"}
          >
            burn editions (irreversible)
          </Button>
        </div>
      </Fieldset>
    </Form>
  )
}