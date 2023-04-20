import React, { memo, useCallback } from "react"
import cs from "classnames"
import style from "./ListOffers.module.scss"
import {
  GenerativeTokenImageAndName,
  ObjktImageAndName,
  TokenImageAndName,
} from "../Objkt/ObjktImageAndName"
import { UserBadge } from "../User/UserBadge"
import { DisplayTezos } from "../Display/DisplayTezos"
import { FloorDifference } from "../Display/FloorDifference"
import { Button, ButtonState } from "../Button"
import { DateDistance } from "../Utils/Date/DateDistance"
import { offerTypeGuard, AnyOffer } from "../../types/entities/Offer"
import { ConnectedUser } from "../../types/entities/User"
import { Objkt } from "../../types/entities/Objkt"
import { GenerativeToken } from "types/entities/GenerativeToken"

export interface OfferProps {
  offer: AnyOffer
  floor: number | null
  showToken?: boolean
  user: ConnectedUser | null
  onClickAccept: (offer: AnyOffer) => void
  onClickCancel: (offer: AnyOffer) => void
  cancelState: ButtonState
  acceptState: ButtonState
  canAccept: Boolean
}

const _Offer = ({
  offer,
  showToken,
  floor,
  user,
  canAccept = false,
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
        [style.small_padding]: !!showToken,
      })}
    >
      {showToken && (
        <div className={cs(style.objkt)}>
          {offerTypeGuard(offer) ? (
            <ObjktImageAndName objkt={offer.objkt} size={50} shortName />
          ) : (
            <GenerativeTokenImageAndName token={offer.token} shortName />
          )}
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
        ) : canAccept ? (
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
