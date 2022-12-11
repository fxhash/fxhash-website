import style from "./InputAddress.module.scss"
import cs from "classnames"
import { InputProps } from "types/Inputs"
import { useUpdateFormObject } from "hooks/useFormUpdate"
import { Field } from "components/Form/Field"
import { InputText } from "./InputText"

export interface IAddress {
  firstName: string
  lastName: string
  address: string
  postalCode: string
  city: string
  state: string
  country: string
}

interface Props extends InputProps<IAddress> {
  errors?: any
}
export function InputAddress({ value, onChange, errors }: Props) {
  const update = useUpdateFormObject(value, onChange)

  return (
    <div className={cs(style.root)}>
      <div className={cs(style.col2)}>
        <Field error={errors?.firstName}>
          <strong>First name *</strong>
          <InputText
            value={value.firstName}
            onChange={(evt) => update("firstName", evt.target.value)}
            placeholder="John"
            error={!!errors?.firstName}
          />
        </Field>
        <Field error={errors?.lastName}>
          <strong>Last name *</strong>
          <InputText
            value={value.lastName}
            onChange={(evt) => update("lastName", evt.target.value)}
            placeholder="Doe"
            error={!!errors?.lastName}
          />
        </Field>
      </div>
      <Field error={errors?.address}>
        <strong>Address *</strong>
        <InputText
          value={value.address}
          onChange={(evt) => update("address", evt.target.value)}
          placeholder="28 Super street"
          error={!!errors?.address}
        />
      </Field>
      <div className={cs(style.col2)}>
        <Field error={errors?.postalCode}>
          <strong>Postal code *</strong>
          <InputText
            value={value.postalCode}
            onChange={(evt) => update("postalCode", evt.target.value)}
            placeholder="16384"
            error={!!errors?.postalCode}
          />
        </Field>
        <Field error={errors?.city}>
          <strong>City *</strong>
          <InputText
            value={value.city}
            onChange={(evt) => update("city", evt.target.value)}
            placeholder="London"
            error={!!errors?.city}
          />
        </Field>
      </div>
      <div className={cs(style.col2)}>
        <Field error={errors?.state}>
          <strong>State</strong>
          <InputText
            value={value.state}
            onChange={(evt) => update("state", evt.target.value)}
            placeholder="California"
            error={!!errors?.state}
          />
        </Field>
        <Field error={errors?.country}>
          <strong>Country *</strong>
          <InputText
            value={value.country}
            onChange={(evt) => update("country", evt.target.value)}
            placeholder="USA"
            error={!!errors?.country}
          />
        </Field>
      </div>
    </div>
  )
}
