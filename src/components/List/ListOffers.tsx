import style from "./ListOffers.module.scss"
import cs from "classnames"
import {
  AnyOffer,
  CollectionOffer,
  offerTypeGuard,
} from "../../types/entities/Offer"
import { Fragment, useCallback, useContext, useState } from "react"
import { UserContext } from "../../containers/UserProvider"
import { Objkt } from "../../types/entities/Objkt"
import { useContractOperation } from "../../hooks/useContractOperation"
import { OfferCancelOperation } from "../../services/contract-operations/OfferCancel"
import { ContractFeedback } from "../Feedback/ContractFeedback"
import { OfferAcceptOperation } from "../../services/contract-operations/OfferAccept"
import Skeleton from "../Skeleton"
import { Offer } from "./Offer"
import { OfferMobile } from "./OfferMobile"
import { CollectionOfferCancelOperation } from "services/contract-operations/CollectionOfferCancel"
import { GenerativeToken } from "types/entities/GenerativeToken"
import { useModal } from "hooks/useModal"
import { ModalAcceptCollectionOffer } from "components/Offers/ModalAcceptCollectionOffer"

const ListOfferFeedback = ({ offer, contractBag, successMessage }: any) => {
  const showFeedback = contractBag.params?.offer.id === offer.id
  if (!showFeedback) return null

  return (
    <div className={cs(style.contract_feedback)}>
      <ContractFeedback
        state={contractBag.state}
        loading={contractBag.loading}
        success={contractBag.success}
        error={contractBag.error}
        successMessage={successMessage}
        noSpacing
      />
    </div>
  )
}

interface Props {
  objkt?: Objkt
  generativeToken?: GenerativeToken
  offers: AnyOffer[]
  className?: string
  ownsGentkInCollection?: boolean
  showToken?: boolean
  loading?: boolean
  floor: number | null
}
export function ListOffers({
  objkt,
  generativeToken,
  offers,
  className,
  ownsGentkInCollection = false,
  showToken = false,
  loading = false,
  floor,
}: Props) {
  const { user } = useContext(UserContext)

  const offerCancelBag = useContractOperation(OfferCancelOperation)
  const collectionOfferCancelBag = useContractOperation(
    CollectionOfferCancelOperation
  )

  const offerAcceptBag = useContractOperation(OfferAcceptOperation)

  const [selectedOffer, setSelectedOffer] = useState<CollectionOffer | null>(
    null
  )
  const [{ isOpen, openModal }, AcceptCollectionOfferModal] = useModal(
    ModalAcceptCollectionOffer,
    {
      offer: selectedOffer,
    }
  )

  const cancelOffer = (offer: AnyOffer) => {
    if (offerTypeGuard(offer))
      return offerCancelBag.call({
        offer,
        objkt: objkt || offer.objkt,
      })

    return collectionOfferCancelBag.call({
      offer,
      token: generativeToken || offer.token,
    })
  }

  const acceptOffer = (offer: AnyOffer) => {
    if (offerTypeGuard(offer))
      return offerAcceptBag.call({
        offer,
        token: objkt || offer.objkt,
        price: offer.price,
      })

    setSelectedOffer(offer)
    openModal()
  }

  const canAcceptOffer = useCallback(
    (offer: AnyOffer) => {
      if (offerTypeGuard(offer))
        return (objkt?.owner?.id || offer.objkt?.owner?.id) === user?.id
      return ownsGentkInCollection
    },
    [objkt, user, ownsGentkInCollection]
  )

  const getCancelState = useCallback(
    (offer: AnyOffer) => {
      if (
        (offerCancelBag.loading &&
          offerCancelBag.params?.offer.id === offer.id) ||
        (collectionOfferCancelBag.loading &&
          collectionOfferCancelBag.params?.offer.id === offer.id)
      )
        return "loading"
      return "default"
    },
    [
      offerCancelBag.loading,
      offerCancelBag.params?.offer.id,
      collectionOfferCancelBag.loading,
      collectionOfferCancelBag.params?.offer.id,
    ]
  )

  const getAcceptState = useCallback(
    (offer: AnyOffer) => {
      if (
        offerAcceptBag.loading &&
        offerAcceptBag.params?.offer.id === offer.id
      )
        return "loading"

      return "default"
    },
    [offerAcceptBag.loading, offerAcceptBag.params?.offer.id]
  )

  return (
    <div className={cs(style.root, className)}>
      {offers?.map((offer) => (
        <Fragment key={`${offer.id}-${offer.version}`}>
          <ListOfferFeedback
            offer={offer}
            contractBag={offerCancelBag}
            successMessage="Your offer has been cancelled"
          />
          <ListOfferFeedback
            offer={offer}
            contractBag={offerAcceptBag}
            successMessage="You have accepted the offer"
          />
          <ListOfferFeedback
            offer={offer}
            contractBag={collectionOfferCancelBag}
            successMessage="Your collection offer has been cancelled"
          />
          <Offer
            user={user}
            showToken={showToken}
            floor={floor}
            offer={offer}
            canAccept={canAcceptOffer(offer)}
            onClickCancel={cancelOffer}
            onClickAccept={acceptOffer}
            cancelState={getCancelState(offer)}
            acceptState={getAcceptState(offer)}
          />
          <OfferMobile
            user={user}
            showToken={showToken}
            floor={floor}
            offer={offer}
            canAccept={canAcceptOffer(offer)}
            onClickCancel={cancelOffer}
            onClickAccept={acceptOffer}
            cancelState={getCancelState(offer)}
            acceptState={getAcceptState(offer)}
          />
        </Fragment>
      ))}
      {loading &&
        [...Array(10)].map((_, idx) => <Skeleton key={idx} height="60px" />)}
      {!loading && offers?.length === 0 && (
        <span>There are no offers on any iteration of this collection.</span>
      )}
      {isOpen && AcceptCollectionOfferModal}
    </div>
  )
}
