import { Button } from "../../components/Button"
import { Objkt } from "../../types/entities/Objkt"
import { ContractFeedback } from "../../components/Feedback/ContractFeedback"
import { displayMutez } from "../../utils/units"
import { useContractOperation } from "../../hooks/useContractOperation"
import { Offer } from "../../types/entities/Offer"
import { OfferCancelOperation } from "../../services/contract-operations/OfferCancel"

interface Props {
  offer: Offer
  objkt: Objkt
}

export function OfferCancel({ offer, objkt }: Props) {
  const {
    state,
    loading: contractLoading,
    error: contractError,
    success,
    call,
    clear,
  } = useContractOperation(OfferCancelOperation)

  const callContract = () => {
    call({
      offer: offer,
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
        successMessage="Your offer has been cancelled"
      />

      <Button
        state={contractLoading ? "loading" : "default"}
        color="primary"
        onClick={callContract}
      >
        cancel offer ({displayMutez(offer.price)} tez)
      </Button>
    </>
  )
}
