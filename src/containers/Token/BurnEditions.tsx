// import style from "./BurnEditions.module.scss"
import cs from "classnames"
import { useContext, useState } from "react"
import { Button } from "../../components/Button"
import { ContractFeedback } from "../../components/Feedback/ContractFeedback"
import { Field } from "../../components/Form/Field"
import { SliderWithText } from "../../components/Input/SliderWithText"
import { SliderWithTextInput } from "../../components/Input/SliderWithTextInput"
import { Spacing } from "../../components/Layout/Spacing"
import { BurnSupplyCallData } from "../../types/ContractCalls"
import { GenerativeToken } from "../../types/entities/GenerativeToken"
import { useContractCall } from "../../utils/hookts"
import { UserContext } from "../UserProvider"

interface Props {
  token: GenerativeToken
}
export function BurnEditions({ token }: Props) {
  const [amount, setAmount] = useState<number>(0)
  const max = token.balance

  const userCtx = useContext(UserContext)

  const { state: callState, loading: contractLoading, success, call, error: contractError } = 
    useContractCall<BurnSupplyCallData>(userCtx.walletManager!.burnSupply)

  const callContract = () => {
    call({
      amount: amount,
      issuer_id: token.id
    })
  }

  return (
    <>
      <Field>
        <label htmlFor="price">
          Number of editions
        </label>
        <SliderWithTextInput
          min={0}
          max={max}
          step={1}
          value={amount}
          onChange={setAmount}
          textTransform={val => val.toFixed(0)}
          unit=""
        />
      </Field>

      <Spacing size="3x-large"/>

      <ContractFeedback
        state={callState}
        loading={contractLoading}
        success={success}
        error={contractError}
        successMessage="Editions were burnt"
      />

      <Button
        type="button"
        size="medium"
        color="primary"
        disabled={amount === 0}
        onClick={callContract}
        state={contractLoading ? "loading" : "default"}
      >
        burn editions (irreversible)
      </Button>
    </>
  )
}