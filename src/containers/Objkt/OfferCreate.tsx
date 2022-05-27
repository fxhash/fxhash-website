import style from "./MarketplaceActions.module.scss"
import cs from "classnames"
import { useContext, useState } from "react"
import { Button } from "../../components/Button"
import { InputTextUnit } from "../../components/Input/InputTextUnit"
import { Objkt } from "../../types/entities/Objkt"
import { UserContext } from "../UserProvider"
import { ContractFeedback } from "../../components/Feedback/ContractFeedback"
import { useContractOperation } from "../../hooks/useContractOperation"
import { ListingOperation, TListingOperationParams } from "../../services/contract-operations/Listing"
import { IconTezos } from "../../components/Icons/IconTezos"
import { OfferOperation } from "../../services/contract-operations/Offer"

interface Props {
  objkt: Objkt
}

export function OfferCreate({ objkt }: Props) {
  const [opened, setOpened] = useState<boolean>(false)
  const [price, setPrice] = useState<string>("")

  const { state, loading: contractLoading, error: contractError, success, call, clear } = 
    useContractOperation(OfferOperation)

  const callContract = () => {
    const mutez = Math.floor(parseFloat(price) * 1000000)
    if (isNaN(mutez)) {
      alert("Invalid price")
    }
    else {
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
            unit={<IconTezos size="regular"/>}
            type="text"
            sizeX="small"
            value={price}
            onChange={evt => setPrice(evt.target.value)}
            min={0}
            step={0.0000001}
          />
          <Button
            state={contractLoading ? "loading" : "default"}
            color="secondary"
            onClick={callContract}
            size="regular"
          >
            make the offer
          </Button>
        </div>
      ):(
        <Button
          color={opened ? "primary" : "secondary"}
          onClick={() => setOpened(!opened)}
        >
          make an offer
        </Button>
      )}
    </>
  )
}