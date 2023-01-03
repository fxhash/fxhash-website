import { Button } from "../../components/Button"
import { Objkt } from "../../types/entities/Objkt"
import { ContractFeedback } from "../../components/Feedback/ContractFeedback"
import { Listing } from "../../types/entities/Listing"
import { displayMutez } from "../../utils/units"
import { useContractOperation } from "../../hooks/useContractOperation"
import {
  ListingCancelOperation,
  TListingCancelOperationParams,
} from "../../services/contract-operations/ListingCancel"

interface Props {
  listing: Listing
  objkt: Objkt
}

export function ListingCancel({ listing, objkt }: Props) {
  const {
    state,
    loading: contractLoading,
    error: contractError,
    success,
    call,
  } = useContractOperation<TListingCancelOperationParams>(
    ListingCancelOperation
  )

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
