import style from "./MarketplaceActions.module.scss"
import cs from "classnames"
import { useState } from "react"
import { Button } from "../../components/Button"
import { Objkt } from "../../types/entities/Objkt"
import { ContractFeedback } from "../../components/Feedback/ContractFeedback"
import { useContractOperation } from "../../hooks/useContractOperation"
import { IconTezos } from "../../components/Icons/IconTezos"
import { OfferOperation } from "../../services/contract-operations/Offer"
import { InputText } from "../../components/Input/InputText"
import { InputTextUnit } from "../../components/Input/InputTextUnit"

interface Props {
  objkt: Objkt
}

export function OfferCreate({ objkt }: Props) {
  const [opened, setOpened] = useState<boolean>(true)
  const [price, setPrice] = useState<string>("")

  const {
    state,
    loading: contractLoading,
    error: contractError,
    success,
    call,
  } = useContractOperation(OfferOperation)

  const callContract = () => {
    const mutez = Math.floor(parseFloat(price) * 1000000)
    if (isNaN(mutez)) {
      alert("Invalid price")
    } else {
      call({
        token: objkt,
        price: mutez,
      })
    }
  }

  return (
    <>
      <ContractFeedback
        state={state}
        loading={contractLoading}
        success={success}
        error={contractError}
        successMessage="Your offer has been placed"
      />

      {opened ? (
        <div className={cs(style.inputs)}>
          <InputTextUnit
            type="number"
            unit={<IconTezos size="regular" />}
            positionUnit="inside-left"
            sizeX="fill"
            value={price}
            onChange={(evt) => setPrice(evt.target.value)}
            min={0}
            step={0.0000001}
            className={style.input}
          />
          <Button
            state={contractLoading ? "loading" : "default"}
            color="secondary"
            onClick={callContract}
            size="regular"
            className={style.button_listing}
            disabled={!price}
          >
            make offer
          </Button>
        </div>
      ) : (
        <Button
          color={opened ? "primary" : "secondary"}
          onClick={() => setOpened(!opened)}
          size="regular"
        >
          make offer
        </Button>
      )}
    </>
  )
}
