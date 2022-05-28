import style from "./ListOffers.module.scss"
import cs from "classnames"
import { Offer } from "../../types/entities/Offer"
import { Fragment, useContext } from "react"
import { UserBadge } from "../User/UserBadge"
import { DisplayTezos } from "../Display/DisplayTezos"
import { DateDistance } from "../Activity/Action"
import { UserContext } from "../../containers/UserProvider"
import { Objkt } from "../../types/entities/Objkt"
import { Button } from "../Button"
import { useContractOperation } from "../../hooks/useContractOperation"
import { OfferCancelOperation } from "../../services/contract-operations/OfferCancel"
import { ContractFeedback } from "../Feedback/ContractFeedback"
import { OfferAcceptOperation } from "../../services/contract-operations/OfferAccept"
import { ObjktImageAndName } from "../Objkt/ObjktImageAndName"
import Skeleton from "../Skeleton"
import { FloorDifference } from "../Display/FloorDifference"

interface Props {
  objkt?: Objkt
  offers: Offer[]
  className?: string
  showObjkt?: boolean
  loading?: boolean
  floor: number|null
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
    call: cancelCall ,
    params: cancelParams,
  } = useContractOperation(OfferCancelOperation)

  const cancelOffer = (offer: Offer) => {
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
    call: acceptCall ,
    params: acceptParams,
  } = useContractOperation(OfferAcceptOperation)

  const acceptOffer = (offer: Offer) => {
    acceptCall({
      offer: offer,
      token: objkt || offer.objkt,
      price: offer.price
    })
  }

  return (
    <div className={cs(style.root, className)}>
      {offers?.map(offer => (
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
          <div className={cs(style.offer, {
            [style.small_padding]: !!showObjkt
          })}>
            {showObjkt && (
              <div className={cs(style.objkt)}>
                <ObjktImageAndName
                  objkt={offer.objkt}
                  size={50}
                  shortName
                />
              </div>
            )}
            <div className={cs(style.user_badge_wrapper)}>
              <UserBadge
                user={offer.buyer}
                size="small"
              />
            </div>
            <DisplayTezos
              mutez={offer.price}
              formatBig={false}
              className={cs(style.price)}
            />
            <FloorDifference
              price={offer.price}
              floor={floor}
              append="floor"
            />
            <div className={cs(style.call_btn)}>
              {offer.buyer.id === user?.id ? (
                <Button
                  type="button"
                  color="primary"
                  size="very-small"
                  onClick={() => cancelOffer(offer)}
                  state={cancelLoading && cancelParams?.offer.id === offer.id ? "loading" : "default"}
                >
                  cancel
                </Button>
              ):(objkt?.owner?.id || offer.objkt?.owner?.id) === user?.id ? (
                <Button
                  type="button"
                  color="secondary"
                  size="very-small"
                  onClick={() => acceptOffer(offer)}
                  state={acceptLoading && acceptParams?.offer.id === offer.id ? "loading" : "default"}
                >
                  accept
                </Button>
              ):null}
            </div>
            <div className={cs(style.date)}>
              <DateDistance
                timestamptz={offer.createdAt}
              />
            </div>
          </div>
        </Fragment>
      ))}
      {loading && [...Array(10)].map((_, idx) => (
        <Skeleton height="60px"/>
      ))}
      {!loading && offers?.length === 0 && (
        <span>There are no offers on any iteration of this collection.</span>
      )}
    </div>
  )
}