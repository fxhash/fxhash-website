// import style from "./OfferActions.module.scss"
import cs from "classnames"
import { FunctionComponent, useContext, useMemo } from "react"
import { UserContext } from "../../containers/UserProvider"
import { useContractOperation } from "../../hooks/useContractOperation"
import { OfferAcceptOperation } from "../../services/contract-operations/OfferAccept"
import { OfferCancelOperation } from "../../services/contract-operations/OfferCancel"
import { Objkt } from "../../types/entities/Objkt"
import { Offer } from "../../types/entities/Offer"
import { Button } from "../Button"
import { ContractFeedback } from "../Feedback/ContractFeedback"

interface PropsChildren {
  buttons: JSX.Element | null
  feedback: JSX.Element | null
}

interface Props {
  offer: Offer
  objkt?: Objkt
  children: FunctionComponent<PropsChildren>
}

/**
 * OfferActions is a control component which is responsible for any logic
 * related to an offer's actions. It can trigger the accept & cancel operations
 * based on the user's degree of control over the offer.
 * It is not render opiniated and the parent component is responsible for
 * styling.
 */
export function OfferActions({ offer, objkt, children }: Props) {
  const { user } = useContext(UserContext)

  // ensures that objkt is set even if not passed as prop
  const objktSafe = objkt || offer.objkt

  const {
    state: cancelState,
    loading: cancelLoading,
    error: cancelError,
    success: cancelSuccess,
    call: cancelCall,
    params: cancelParams,
  } = useContractOperation(OfferCancelOperation)

  const cancelOffer = (offer: Offer) => {
    cancelCall({
      offer: offer,
      objkt: objktSafe,
    })
  }

  const {
    state: acceptState,
    loading: acceptLoading,
    error: acceptError,
    success: acceptSuccess,
    call: acceptCall,
    params: acceptParams,
  } = useContractOperation(OfferAcceptOperation)

  const acceptOffer = (offer: Offer) => {
    acceptCall({
      offer: offer,
      token: objktSafe,
      price: offer.price,
    })
  }

  // the buttons, call to actions for the contracts
  const buttons =
    offer.buyer.id === user?.id ? (
      <Button
        type="button"
        color="primary"
        size="very-small"
        onClick={() => cancelOffer(offer)}
        state={
          cancelLoading && cancelParams?.offer.id === offer.id
            ? "loading"
            : "default"
        }
      >
        cancel
      </Button>
    ) : objktSafe.owner?.id === user?.id ? (
      <Button
        type="button"
        color="secondary"
        size="very-small"
        onClick={() => acceptOffer(offer)}
        state={
          acceptLoading && acceptParams?.offer.id === offer.id
            ? "loading"
            : "default"
        }
      >
        accept
      </Button>
    ) : null

  // contract feedback component
  const feedback =
    cancelParams?.offer.id === offer.id ? (
      <ContractFeedback
        state={cancelState}
        loading={cancelLoading}
        success={cancelSuccess}
        error={cancelError}
        successMessage="Your offer has been cancelled"
        noSpacing
      />
    ) : acceptParams?.offer.id === offer.id ? (
      <ContractFeedback
        state={acceptState}
        loading={acceptLoading}
        success={acceptSuccess}
        error={acceptError}
        successMessage="You have accepted the offer"
        noSpacing
      />
    ) : null

  return children({
    buttons,
    feedback,
  })
}
