import style from "./MarketplaceActions.module.scss"
import cs from "classnames"
import { useState } from "react"
import { Button } from "../../components/Button"
import { ContractFeedback } from "../../components/Feedback/ContractFeedback"
import { useContractOperation } from "../../hooks/useContractOperation"
import { IconTezos } from "../../components/Icons/IconTezos"
import { InputTextUnit } from "../../components/Input/InputTextUnit"
import { CollectionOfferOperation } from "services/contract-operations/CollectionOffer"
import { GenerativeToken } from "types/entities/GenerativeToken"

interface Props {
  token: GenerativeToken
}

export function CollectionOfferCreate({ token }: Props) {
  const [opened, setOpened] = useState<boolean>(true)
  const [price, setPrice] = useState<string>("")

  const {
    state,
    loading: contractLoading,
    error: contractError,
    success,
    call,
  } = useContractOperation(CollectionOfferOperation)

  const callContract = () => {
    const mutez = Math.floor(parseFloat(price) * 1000000)
    if (isNaN(mutez)) {
      alert("Invalid price")
    } else {
      try {
        call({
          token,
          amount: 1,
          price: mutez,
        })
      } catch (e) {
        console.log(e)
      }
    }
  }

  return (
    <>
      <ContractFeedback
        state={state}
        loading={contractLoading}
        success={success}
        error={contractError}
        successMessage="Your collection offer has been placed"
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
