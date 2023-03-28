import style from "./EditStyle.module.scss"
import layout from "styles/Layout.module.scss"
import cs from "classnames"
import { GenerativeToken } from "types/entities/GenerativeToken"
import { Form } from "components/Form/Form"
import { Fieldset } from "components/Form/Fieldset"
import { Field } from "components/Form/Field"
import { Spacing } from "components/Layout/Spacing"
import { Button } from "components/Button"
import { useContractOperation } from "hooks/useContractOperation"
import { ContractFeedback } from "components/Feedback/ContractFeedback"
import { SliderWithTextInput } from "components/Input/SliderWithTextInput"
import { FormEventHandler, useState } from "react"
import { TContractOperation } from "services/contract-operations/ContractOperation"

interface Props {
  token: GenerativeToken
  contractOperation: TContractOperation<any>
}
export function BurnEditions({ token, contractOperation }: Props) {
  const { call, loading, error, success, state } =
    useContractOperation(contractOperation)

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
    <Form onSubmit={update}>
      <Fieldset
        className={cs({
          [style.disabled]: disabled,
        })}
      >
        <h4>Burn editions</h4>
        <Spacing size="large" />

        {disabled && (
          <>
            <span className={cs(style.disabled_message)}>
              You cannot burn editions once minting is completed.
            </span>
            <Spacing size="large" />
          </>
        )}

        <Field>
          <label htmlFor="price">Number of editions to burn</label>
          <SliderWithTextInput
            min={0}
            max={token.balance}
            step={1}
            value={editions}
            onChange={setEditions}
            textTransform={(val) => val.toFixed(0)}
            unit=""
          />
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
