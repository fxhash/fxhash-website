import style from "../Shared/EditStyle.module.scss"
import layout from "styles/Layout.module.scss"
import cs from "classnames"
import * as Yup from "yup"
import { GenerativeToken, GenTokPricing } from "types/entities/GenerativeToken"
import { Formik } from "formik"
import { Form } from "components/Form/Form"
import { Fieldset } from "components/Form/Fieldset"
import { Spacing } from "components/Layout/Spacing"
import { Button } from "components/Button"
import { useContractOperation } from "hooks/useContractOperation"
import { ContractFeedback } from "components/Feedback/ContractFeedback"
import {
  transformPricingDutchNumbersToString,
  transformPricingFixedNumbersToString,
} from "utils/transformers/pricing"
import { YupPricingDutchAuction, YupPricingFixed } from "utils/yup/price"
import { InputPricing } from "containers/Input/Pricing"
import { useMemo } from "react"
import { GenTokPricingForm } from "types/Mint"
import { generateInitialPricingDutchAuction } from "utils/generate/pricing"
import { UpdatePricingV3Operation } from "services/contract-operations/UpdatePricingV3"

const validation = Yup.object({
  pricingFixed: Yup.object().when("pricingMethod", {
    is: GenTokPricing.FIXED,
    then: YupPricingFixed,
  }),
  pricingDutchAuction: Yup.object().when("pricingMethod", {
    is: GenTokPricing.DUTCH_AUCTION,
    then: YupPricingDutchAuction(0, "Must be after now"),
  }),
})

interface Props {
  token: GenerativeToken
}
export function EditPricing({ token }: Props) {
  const { call, loading, error, success, state } = useContractOperation(
    UpdatePricingV3Operation
  )

  const update = (values: GenTokPricingForm<string>) => {
    call({
      data: {
        pricingMethod: values.pricingMethod,
        pricingFixed: values.pricingFixed,
        pricingDutchAuction: values.pricingDutchAuction,
        lockForReserves: values.lockForReserves,
      },
      token: token,
    })
  }

  const disabled = token.balance === 0

  const initialValue = useMemo<GenTokPricingForm<string>>(
    () => ({
      pricingMethod: token.pricingFixed
        ? GenTokPricing.FIXED
        : GenTokPricing.DUTCH_AUCTION,
      pricingFixed: token.pricingFixed
        ? transformPricingFixedNumbersToString(token.pricingFixed)
        : {},
      pricingDutchAuction: token.pricingDutchAuction
        ? transformPricingDutchNumbersToString(token.pricingDutchAuction)
        : generateInitialPricingDutchAuction(),
      // todo
      // lockForReserves: token.lockForReserves,
    }),
    [token]
  )

  return (
    <Formik
      initialValues={initialValue}
      onSubmit={update}
      validationSchema={validation}
    >
      {({ values, setValues, handleSubmit, errors }) => (
        <Form onSubmit={handleSubmit}>
          <Fieldset
            className={cs({
              [style.disabled]: disabled,
            })}
          >
            <h4>Pricing settings</h4>
            <Spacing size="large" />

            {disabled && (
              <>
                <strong className={cs(style.disabled_message)}>
                  You cannot update the pricing once minting is completed.
                </strong>
                <Spacing size="large" />
              </>
            )}

            <InputPricing
              value={values}
              onChange={(val) => setValues(val)}
              errors={errors}
              lockWarning
              noFieldset
            />

            <Spacing size="3x-large" />

            <div className={cs(layout.y_centered)}>
              <ContractFeedback
                state={state}
                loading={loading}
                success={success}
                error={error}
              />
              <Button
                type="submit"
                color="secondary"
                size="regular"
                state={loading ? "loading" : "default"}
                disabled={Object.keys(errors).length > 0}
              >
                edit pricing
              </Button>
            </div>
          </Fieldset>
        </Form>
      )}
    </Formik>
  )
}
