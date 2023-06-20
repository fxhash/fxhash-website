import { Field } from "components/Form/Field"
import { InputAddress } from "components/Input/InputAddress"
import { Spacing } from "components/Layout/Spacing"
import { RedeemableUserActionInputComponent } from "definitions/Redeemable/UserActions"
import { RedeemableUserActionType } from "types/entities/Redeemable"

export const RedeemableUserActionInputAddress: RedeemableUserActionInputComponent<
  RedeemableUserActionType.INPUT_ADDRESS
> = ({ value, onChange, options, error }) => {
  return (
    <Field>
      <label>{options.label}</label>
      {options.hint && <small>{options.hint}</small>}
      <Spacing size="regular" />
      <InputAddress value={value} onChange={onChange} errors={error} />
    </Field>
  )
}
