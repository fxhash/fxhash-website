import style from "./InputAddress.module.scss"
import text from "styles/Text.module.css"
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
          <label>
            <span>
              <span>First name </span>
              <span className={text.secondary}>*</span>
            </span>
            <InputText
              className={style.input}
              value={value.firstName}
              onChange={(evt) => update("firstName", evt.target.value)}
              placeholder="John"
              error={!!errors?.firstName}
            />
          </label>
        </Field>
        <Field error={errors?.lastName}>
          <label>
            <span>
              <span>Last name </span>
              <span className={text.secondary}>*</span>
            </span>
            <InputText
              className={style.input}
              value={value.lastName}
              onChange={(evt) => update("lastName", evt.target.value)}
              placeholder="Doe"
              error={!!errors?.lastName}
            />
          </label>
        </Field>
      </div>
      <Field error={errors?.address}>
        <label>
          <span>
            <span>Address </span>
            <span className={text.secondary}>*</span>
          </span>
          <InputText
            className={style.input}
            value={value.address}
            onChange={(evt) => update("address", evt.target.value)}
            placeholder="28 Super street"
            error={!!errors?.address}
          />
        </label>
      </Field>
      <div className={cs(style.col2)}>
        <Field error={errors?.postalCode}>
          <label>
            <span>
              <span>Postal code </span>
              <span className={text.secondary}>*</span>
            </span>
            <InputText
              className={style.input}
              value={value.postalCode}
              onChange={(evt) => update("postalCode", evt.target.value)}
              placeholder="16384"
              error={!!errors?.postalCode}
            />
          </label>
        </Field>
        <Field error={errors?.city}>
          <label>
            <span>
              <span>City </span>
              <span className={text.secondary}>*</span>
            </span>
            <InputText
              className={style.input}
              value={value.city}
              onChange={(evt) => update("city", evt.target.value)}
              placeholder="London"
              error={!!errors?.city}
            />
          </label>
        </Field>
      </div>
      <div className={cs(style.col2)}>
        <Field error={errors?.state}>
          <label>
            <span>State</span>
            <InputText
              className={style.input}
              value={value.state}
              onChange={(evt) => update("state", evt.target.value)}
              placeholder="California"
              error={!!errors?.state}
            />
          </label>
        </Field>
        <Field error={errors?.country}>
          <label>
            <span>
              <span>Country </span>
              <span className={text.secondary}>*</span>
            </span>
            <InputText
              className={style.input}
              value={value.country}
              onChange={(evt) => update("country", evt.target.value)}
              placeholder="USA"
              error={!!errors?.country}
            />
          </label>
        </Field>
      </div>
    </div>
  )
}
