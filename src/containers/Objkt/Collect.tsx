import style from "./OfferControl.module.scss"
import { useContext, useState } from "react"
import { Button } from "../../components/Button"
import { InputTextUnit } from "../../components/Input/InputTextUnit"
import { Objkt } from "../../types/entities/Objkt"
import cs from "classnames"
import { useContractCall } from "../../utils/hookts"
import { UserContext } from "../UserProvider"
import { CancelOfferCall, CollectCall, PlaceOfferCall } from "../../types/ContractCalls"
import { ContractFeedback } from "../../components/Feedback/ContractFeedback"
import { Offer } from "../../types/entities/Offer"
import { displayMutez } from "../../utils/units"

interface Props {
  offer: Offer
}

export function Collect({ offer }: Props) {
  const userCtx = useContext(UserContext)

  const { state, loading: contractLoading, error: contractError, success, call, clear } = 
    useContractCall<CollectCall>(userCtx.walletManager!.collect)

  const callContract = () => {
    call({
      offerId: offer.id,
      price: offer.price
    })
  }

  return (
    <>
      <ContractFeedback
        state={state}
        loading={contractLoading}
        success={success}
        error={contractError}
        successMessage="You have collected this token !"
      />

      <Button
        state={contractLoading ? "loading" : "default"}
        color="secondary"
        onClick={callContract}
      >
        collect token - {displayMutez(offer.price)} tez
      </Button>
    </>
  )
}