import style from "./OfferActions.module.scss"
import { FunctionComponent, useContext } from "react"
import { UserContext } from "../../containers/UserProvider"
import { useContractOperation } from "../../hooks/useContractOperation"
import { Objkt } from "../../types/entities/Objkt"
import { CollectionOffer } from "../../types/entities/Offer"
import { Button } from "../Button"
import { ContractFeedback } from "../Feedback/ContractFeedback"
import { CollectionOfferCancelOoperation } from "services/contract-operations/CollectionOfferCancel"
import { CollectionOfferAcceptOperation } from "services/contract-operations/CollectionOfferAccept"
import { useRouter } from "next/router"
import { useModal } from "hooks/useModal"
import { ModalAcceptCollectionOffer } from "./ModalAcceptCollectionOffer"

interface PropsChildren {
  buttons: JSX.Element | null
  feedback: JSX.Element | null
}

interface Props {
  offer: CollectionOffer
  children: FunctionComponent<PropsChildren>
}

// TODO!

/**
 * CollectionOfferActions is a control component which is responsible for any logic
 * related to a collection offer's actions. It can trigger the accept & cancel operations
 * based on the user's degree of control over the offer.
 * It is not render opiniated and the parent component is responsible for
 * styling.
 */
export function CollectionOfferActions({ offer, children }: Props) {
  const { query } = useRouter()
  const { user } = useContext(UserContext)

  const [{ isOpen, openModal }, AcceptCollectionOfferModal] = useModal(
    ModalAcceptCollectionOffer,
    {
      offer,
      onClickAccept: (objkt: Objkt) => acceptOffer(objkt),
    }
  )

  // checks if the current user is the target of the offer
  const isCurrentUser = query.name === user?.name || query.id === user?.id

  const {
    state: cancelState,
    loading: cancelLoading,
    error: cancelError,
    success: cancelSuccess,
    call: cancelCall,
    params: cancelParams,
  } = useContractOperation(CollectionOfferCancelOoperation)

  const cancelOffer = (offer: CollectionOffer) => {
    cancelCall({
      offer: offer,
      token: offer.token,
    })
  }

  const {
    state: acceptState,
    loading: acceptLoading,
    error: acceptError,
    success: acceptSuccess,
    call: acceptCall,
    params: acceptParams,
  } = useContractOperation(CollectionOfferAcceptOperation)

  const acceptOffer = (objkt: Objkt) => {
    acceptCall({
      offer: offer,
      token: objkt,
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
        className={style.button}
        onClick={() => cancelOffer(offer)}
        state={
          cancelLoading && cancelParams?.offer.id === offer.id
            ? "loading"
            : "default"
        }
      >
        cancel
      </Button>
    ) : isCurrentUser ? (
      <Button
        type="button"
        color="secondary"
        size="very-small"
        className={style.button}
        onClick={openModal}
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
        successMessage="Your collection offer has been cancelled"
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

  return (
    <>
      {children({
        buttons,
        feedback,
      })}
      {isOpen && AcceptCollectionOfferModal}
    </>
  )
}
