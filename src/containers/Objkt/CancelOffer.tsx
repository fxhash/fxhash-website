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
import { Listing } from "../../types/entities/Listing"
import { displayMutez } from "../../utils/units"
import { useContractOperation } from "../../hooks/useContractOperation"
import { ListingCancelOperation, TListingCancelOperationParams } from "../../services/contract-operations/ListingCancel"

interface Props {
  listing: Listing
  objkt: Objkt
}

export function CancelOffer({ listing, objkt }: Props) {
  const userCtx = useContext(UserContext)

  const { state, loading: contractLoading, error: contractError, success, call, clear } = 
    useContractOperation<TListingCancelOperationParams>(ListingCancelOperation)

  const callContract = () => {
    call({
      listing: listing,
      objkt: objkt,
    })
  }

  return (
    <>
      <ContractFeedback
        state={state}
        loading={contractLoading}
        success={success}
        error={contractError}
        successMessage="Your listing has been cancelled"
      />

      <Button
        state={contractLoading ? "loading" : "default"}
        color="primary"
        onClick={callContract}
      >
        cancel listing ({displayMutez(listing.price)} tez)
      </Button>
    </>
  )
}