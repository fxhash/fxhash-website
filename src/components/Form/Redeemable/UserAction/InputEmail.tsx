import { Field } from "components/Form/Field"
import { InputText } from "components/Input/InputText"
import { Spacing } from "components/Layout/Spacing"
import { RedeemableUserActionInputComponent } from "definitions/Redeemable/UserActions"
import { RedeemableUserActionType } from "types/entities/Redeemable"

export const RedeemableUserActionInputEmail: RedeemableUserActionInputComponent<
  RedeemableUserActionType.INPUT_EMAIL
> = ({ value, onChange, options, error }) => {
  return (
    <Field error={error}>
      <label>{options.label}</label>
      {options.hint && <small>{options.hint}</small>}
      <Spacing size="regular" />
      <InputText
        value={value}
        onChange={(evt) => onChange(evt.target.value)}
        placeholder="johndoe@gmail.com"
        error={!!error}
      />
    </Field>
  )
}
