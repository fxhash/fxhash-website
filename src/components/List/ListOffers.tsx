import style from "./ListOffers.module.scss"
import cs from "classnames"
import { Offer as IOffer } from "../../types/entities/Offer"
import { Fragment, useContext } from "react"
import { UserContext } from "../../containers/UserProvider"
import { Objkt } from "../../types/entities/Objkt"
import { useContractOperation } from "../../hooks/useContractOperation"
import { OfferCancelOperation } from "../../services/contract-operations/OfferCancel"
import { ContractFeedback } from "../Feedback/ContractFeedback"
import { OfferAcceptOperation } from "../../services/contract-operations/OfferAccept"
import Skeleton from "../Skeleton"
import { Offer } from "./Offer"
import { OfferMobile } from "./OfferMobile";

interface Props {
  objkt?: Objkt
  offers: IOffer[]
  className?: string
  showObjkt?: boolean
  loading?: boolean
  floor: number | null
}
export function ListOffers({
  objkt,
  offers,
  className,
  showObjkt = false,
  loading = false,
  floor,
}: Props) {
  const { user } = useContext(UserContext)

  const {
    state: cancelState,
    loading: cancelLoading,
    error: cancelError,
    success: cancelSuccess,
    call: cancelCall,
    params: cancelParams,
  } = useContractOperation(OfferCancelOperation)

  const cancelOffer = (offer: IOffer) => {
    cancelCall({
      offer: offer,
      objkt: objkt || offer.objkt,
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

  const acceptOffer = (offer: IOffer) => {
    acceptCall({
      offer: offer,
      token: objkt || offer.objkt,
      price: offer.price,
    })
  }

  return (
    <div className={cs(style.root, className)}>
      {offers?.map((offer) => (
        <Fragment key={`${offer.id}-${offer.version}`}>
          {cancelParams?.offer.id === offer.id && (
            <div className={cs(style.contract_feedback)}>
              <ContractFeedback
                state={cancelState}
                loading={cancelLoading}
                success={cancelSuccess}
                error={cancelError}
                successMessage="Your offer has been cancelled"
                noSpacing
              />
            </div>
          )}
          {acceptParams?.offer.id === offer.id && (
            <div className={cs(style.contract_feedback)}>
              <ContractFeedback
                state={acceptState}
                loading={acceptLoading}
                success={acceptSuccess}
                error={acceptError}
                successMessage="You have accepted the offer"
                noSpacing
              />
            </div>
          )}
          <Offer
            user={user}
            showObjkt={showObjkt}
            objkt={objkt}
            floor={floor}
            offer={offer}
            onClickCancel={cancelOffer}
            onClickAccept={acceptOffer}
            cancelState={
              cancelLoading && cancelParams?.offer.id === offer.id
                ? "loading"
                : "default"
            }
            acceptState={
              acceptLoading && acceptParams?.offer.id === offer.id
                ? "loading"
                : "default"
            }
          />
          <OfferMobile
            user={user}
            showObjkt={showObjkt}
            objkt={objkt}
            floor={floor}
            offer={offer}
            onClickCancel={cancelOffer}
            onClickAccept={acceptOffer}
            cancelState={
              cancelLoading && cancelParams?.offer.id === offer.id
                ? "loading"
                : "default"
            }
            acceptState={
              acceptLoading && acceptParams?.offer.id === offer.id
                ? "loading"
                : "default"
            }
          />
        </Fragment>
      ))}
      {loading &&
        [...Array(10)].map((_, idx) => <Skeleton key={idx} height="60px" />)}
      {!loading && offers?.length === 0 && (
        <span>There are no offers on any iteration of this collection.</span>
      )}
    </div>
  )
}
