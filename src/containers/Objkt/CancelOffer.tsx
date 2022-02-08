import style from "./OfferControl.module.scss"
import { useContext, useState } from "react"
import { Button } from "../../components/Button"
import { InputTextUnit } from "../../components/Input/InputTextUnit"
import { Objkt } from "../../types/entities/Objkt"
import cs from "classnames"
import { useContractCall } from "../../utils/hookts"
import { UserContext } from "../UserProvider"
import { CancelOfferCall, PlaceOfferCall } from "../../types/ContractCalls"
import { ContractFeedback } from "../../components/Feedback/ContractFeedback"
import { Offer } from "../../types/entities/Offer"
import { displayMutez } from "../../utils/units"

interface Props {
  offer: Offer
}

export function CancelOffer({ offer }: Props) {
  const userCtx = useContext(UserContext)

  const { state, loading: contractLoading, error: contractError, success, call, clear } = 
    useContractCall<CancelOfferCall>(userCtx.walletManager!.cancelOffer)

  const callContract = () => {
    call({
      offerId: offer.id
    })
  }

  return (
    <>
      <ContractFeedback
        state={state}
        loading={contractLoading}
        success={success}
        error={contractError}
        successMessage="Your offer has been cancelled"
      />

      <Button
        state={contractLoading ? "loading" : "default"}
        color="primary"
        onClick={callContract}
      >
        cancel trade ({displayMutez(offer.price)} tez)
      </Button>
    </>
  )
}