import style from "containers/Token/EditToken.module.scss"
import editStyle from "./EditStyle.module.scss"
import layout from "styles/Layout.module.scss"
import cs from "classnames"
import * as Yup from "yup"
import {
  GenerativeToken,
  GenerativeTokenVersion,
} from "types/entities/GenerativeToken"
import { Formik } from "formik"
import { Form } from "components/Form/Form"
import { Fieldset } from "components/Form/Fieldset"
import { Field } from "components/Form/Field"
import { Checkbox } from "components/Input/Checkbox"
import { Spacing } from "components/Layout/Spacing"
import { InputTextUnit } from "components/Input/InputTextUnit"
import { InputSplits } from "components/Input/InputSplits"
import { transformSplitsSum1000 } from "utils/transformers/splits"
import { FxhashContracts } from "types/Contracts"
import { Button } from "components/Button"
import { useContractOperation } from "hooks/useContractOperation"
import { UpdateIssuerForm } from "types/UpdateIssuer"
import { ContractFeedback } from "components/Feedback/ContractFeedback"
import { YupRoyalties } from "utils/yup/royalties"
import { YupSplits } from "utils/yup/splits"
import { Donations } from "containers/Input/Donations"
import { TContractOperation } from "services/contract-operations/ContractOperation"

const validation = Yup.object().shape({
  royalties: YupRoyalties,
  splitsPrimary: YupSplits,
  splitsSecondary: YupSplits,
})

interface Props {
  token: GenerativeToken
  contractOperation: TContractOperation<any>
}
export function EditGeneralSettings({ token, contractOperation }: Props) {
  const { call, loading, error, success, state } =
    useContractOperation(contractOperation)

  const update = (values: UpdateIssuerForm<string>) => {
    call({
      token: token,
      data: values,
    })
  }

  const disabled = token.balance === 0

  const gentkContract =
    token.version === GenerativeTokenVersion.V3
      ? FxhashContracts.GENTK_V3
      : FxhashContracts.GENTK_V2

  return (
    <Formik
      initialValues={{
        enabled: token.enabled,
        royalties: "" + token.royalties / 10,
        splitsPrimary: token.splitsPrimary.map((split) => ({
          address: split.user.id,
          pct: split.pct,
        })),
        splitsSecondary: token.splitsSecondary.map((split) => ({
          address: split.user.id,
          pct: split.pct,
        })),
      }}
      onSubmit={update}
      validationSchema={validation}
    >
      {({
        values,
        setFieldValue,
        handleSubmit,
        handleChange,
        handleBlur,
        errors,
      }) => (
        <Form onSubmit={handleSubmit}>
          <Fieldset
            className={cs({
              [editStyle.disabled]: disabled,
            })}
          >
            <h4>General settings</h4>
            <Spacing size="large" />

            {disabled && (
              <>
                <span className={cs(editStyle.disabled_message)}>
                  You cannot edit the general settings once minting is
                  completed.
                </span>
                <Spacing size="large" />
              </>
            )}

            <Field className={cs(style.checkbox)}>
              <Checkbox
                name="enabled"
                value={values.enabled!}
                onChange={(_, event) => handleChange(event)}
              >
                Enabled
              </Checkbox>
            </Field>

            <Field
              error={
                typeof errors.splitsPrimary === "string"
                  ? errors.splitsPrimary
                  : undefined
              }
            >
              <label>
                Primary Splits
                <small>
                  You can split the proceeds on primary between different
                  addresses
                </small>
              </label>
              <InputSplits
                value={values.splitsPrimary}
                onChange={(splits) => setFieldValue("splitsPrimary", splits)}
                sharesTransformer={transformSplitsSum1000}
                textShares="Shares (out of 1000)"
                errors={errors.splitsPrimary as any}
              >
                {({ addAddress }) => (
                  <div className={cs(editStyle.royalties_last_row)}>
                    <Donations onClickDonation={addAddress} />
                  </div>
                )}
              </InputSplits>
            </Field>

            <Field error={errors.royalties}>
              <label htmlFor="royalties">
                Royalties
                <small>in %, between 10 and 25</small>
              </label>
              <InputTextUnit
                unit="%"
                type="text"
                name="royalties"
                value={values.royalties || ""}
                onChange={handleChange}
                onBlur={handleBlur}
                error={!!errors.royalties}
              />
            </Field>

            <Field
              error={
                typeof errors.splitsSecondary === "string"
                  ? errors.splitsSecondary
                  : undefined
              }
            >
              <label>
                Secondary Splits
                <small>
                  You can also split the proceeds on the secondary (royalties
                  will be divided between the addresses)
                </small>
              </label>
              <InputSplits
                value={values.splitsSecondary}
                onChange={(splits) => setFieldValue("splitsSecondary", splits)}
                sharesTransformer={transformSplitsSum1000}
                textShares="Shares (out of 1000)"
                errors={errors.splitsSecondary as any}
              >
                {({ addAddress }) => (
                  <div className={cs(editStyle.royalties_last_row)}>
                    {!values.splitsSecondary.find(
                      (split) => split.address === gentkContract
                    ) && (
                      <Button
                        type="button"
                        size="very-small"
                        iconComp={
                          <i className="fa-solid fa-plus" aria-hidden />
                        }
                        onClick={() => {
                          addAddress(gentkContract)
                        }}
                      >
                        royalties to the minter
                      </Button>
                    )}
                    <Donations onClickDonation={addAddress} />
                  </div>
                )}
              </InputSplits>
            </Field>

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
                edit general settings
              </Button>
            </div>
          </Fieldset>
        </Form>
      )}
    </Formik>
  )
}
