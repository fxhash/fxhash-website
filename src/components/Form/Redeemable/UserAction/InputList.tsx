import { Field } from "components/Form/Field"
import { InputSelectFromItems } from "components/Input/InputSelectFromItems"
import { InputText } from "components/Input/InputText"
import { Spacing } from "components/Layout/Spacing"
import { RedeemableUserActionInputComponent } from "definitions/Redeemable/UserActions"
import { RedeemableUserActionType } from "types/entities/Redeemable"

export const RedeemableUserActionInputList: RedeemableUserActionInputComponent<
  RedeemableUserActionType.INPUT_LIST
> = ({ value, onChange, options, error }) => {
  return (
    <Field error={error}>
      <label>{options.label}</label>
      {options.hint && <small>{options.hint}</small>}
      <Spacing size="regular" />
      <InputSelectFromItems
        items={options.values}
        getItemValue={(v) => v}
        value={value}
        onChange={(val) => onChange(val)}
      >
        {({ item }) => <span>{item}</span>}
      </InputSelectFromItems>
    </Field>
  )
}
