import React, { memo, useCallback } from "react"
import cs from "classnames"
import style from "./ListOffers.module.scss"
import { ObjktImageAndName } from "../Objkt/ObjktImageAndName"
import { UserBadge } from "../User/UserBadge"
import { DisplayTezos } from "../Display/DisplayTezos"
import { FloorDifference } from "../Display/FloorDifference"
import { Button, ButtonState } from "../Button"
import { DateDistance } from "../Utils/Date/DateDistance"
import { Offer as IOffer } from "../../types/entities/Offer"
import { ConnectedUser } from "../../types/entities/User"
import { Objkt } from "../../types/entities/Objkt"

export interface OfferProps {
  objkt?: Objkt
  offer: IOffer
  floor: number | null
  showObjkt?: boolean
  user: ConnectedUser | null
  onClickAccept: (offer: IOffer) => void
  onClickCancel: (offer: IOffer) => void
  cancelState: ButtonState
  acceptState: ButtonState
}

const _Offer = ({
  objkt,
  offer,
  showObjkt,
  floor,
  user,
  onClickCancel,
  onClickAccept,
  cancelState,
  acceptState,
}: OfferProps) => {
  const handleClickCancel = useCallback(() => {
    onClickCancel(offer)
  }, [offer, onClickCancel])
  const handleClickAccept = useCallback(() => {
    onClickAccept(offer)
  }, [offer, onClickAccept])
  return (
    <div
      className={cs(style.offer, {
        [style.small_padding]: !!showObjkt,
      })}
    >
      {showObjkt && (
        <div className={cs(style.objkt)}>
          <ObjktImageAndName objkt={offer.objkt} size={50} shortName />
        </div>
      )}
      <div className={cs(style.user_badge_wrapper)}>
        <UserBadge user={offer.buyer} size="small" />
      </div>
      <DisplayTezos
        mutez={offer.price}
        formatBig={false}
        className={cs(style.price)}
      />
      <FloorDifference price={offer.price} floor={floor} append="floor" />
      <div className={cs(style.call_btn)}>
        {offer.buyer.id === user?.id ? (
          <Button
            type="button"
            color="primary"
            size="very-small"
            onClick={handleClickCancel}
            state={cancelState}
          >
            cancel
          </Button>
        ) : (objkt?.owner?.id || offer.objkt?.owner?.id) === user?.id ? (
          <Button
            type="button"
            color="secondary"
            size="very-small"
            onClick={handleClickAccept}
            state={acceptState}
          >
            accept
          </Button>
        ) : null}
      </div>
      <div className={cs(style.date)}>
        <DateDistance timestamptz={offer.createdAt} />
      </div>
    </div>
  )
}

export const Offer = memo(_Offer)
