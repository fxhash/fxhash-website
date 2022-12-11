import style from "./Options.module.scss"
import cs from "classnames"
import { DisplayTezos } from "components/Display/DisplayTezos"
import { InputSelectFromItems } from "components/Input/InputSelectFromItems"
import { Select } from "components/Input/Select"
import { FormikErrors, useField } from "formik"
import { useUpdateFormArray } from "hooks/useFormUpdate"
import { RedeemableOption } from "types/entities/Redeemable"
import { InputProps } from "types/Inputs"
import { Field } from "../Field"

interface Props {
  id: string
  options: RedeemableOption[]
  errors?: string | string[]
}
export function FormRedeemableOptions({ id, options, errors }: Props) {
  const [{ value }, {}, { setValue }] = useField<(number | null)[]>(id)
  const { update } = useUpdateFormArray(value, setValue)
  const fieldErrors = Array.isArray(errors)

  return (
    <>
      {options.map((option, idx) => (
        <Field key={idx} error={fieldErrors && errors[idx]}>
          <label>{option.label}</label>
          <InputSelectFromItems
            value={value[idx]}
            items={option.values}
            getItemValue={(_, idx) => idx}
            onChange={(v) => update(idx, v)}
          >
            {({ item }) => (
              <div className={cs(style.option)}>
                <strong>{item.label}</strong>
                <DisplayTezos
                  mutez={item.amount}
                  tezosSize="small"
                  className={cs(style.price)}
                />
              </div>
            )}
          </InputSelectFromItems>
        </Field>
      ))}
    </>
  )
}
