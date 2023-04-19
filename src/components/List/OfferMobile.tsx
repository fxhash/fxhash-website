import React, { memo, useCallback } from "react"
import cs from "classnames"
import style from "./ListOffers.module.scss"
import { UserBadge } from "../User/UserBadge"
import { DisplayTezos } from "../Display/DisplayTezos"
import { FloorDifference } from "../Display/FloorDifference"
import { Button } from "../Button"
import { DateDistance } from "../Utils/Date/DateDistance"
import { OfferProps } from "./Offer"
import Link from "next/link"
import { Image } from "../Image"
import { offerTypeGuard } from "types/entities/Offer"

const _OfferMobile = ({
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
    <div className={cs(style.offer_mobile)}>
      {showToken &&
        (offerTypeGuard(offer) ? (
          <Link href={`/gentk/${offer.objkt.id}`}>
            <a className={style.objkt_image}>
              <Image
                ipfsUri={offer.objkt.metadata?.thumbnailUri}
                image={offer.objkt.captureMedia}
                alt={`thumbnail of ${offer.objkt.name}`}
              />
            </a>
          </Link>
        ) : (
          <Link href={`/generative/${offer.token.id}`}>
            <a className={style.objkt_image}>
              <Image
                ipfsUri={offer.token.metadata?.thumbnailUri}
                image={offer.token.captureMedia}
                alt={`thumbnail of ${offer.token.name}`}
              />
            </a>
          </Link>
        ))}
      <div className={style.infos}>
        <div className={style.infos_iteration}>
          {offerTypeGuard(offer) ? `#${offer.objkt.iteration}` : "Collection"}
        </div>
        <div className={cs(style.user_badge_wrapper)}>
          <UserBadge user={offer.buyer} size="small" />
        </div>
        <div className={style.infos_stats}>
          <DisplayTezos
            mutez={offer.price}
            formatBig={false}
            className={cs(style.price)}
          />
          <FloorDifference price={offer.price} floor={floor} append="floor" />
        </div>
        <div className={cs(style.date)}>
          <DateDistance timestamptz={offer.createdAt} />
        </div>
        {offer.buyer.id === user?.id ? (
          <div className={cs(style.call_btn)}>
            <Button
              type="button"
              color="primary"
              size="very-small"
              onClick={handleClickCancel}
              state={cancelState}
            >
              cancel
            </Button>
          </div>
        ) : canAccept ? (
          <div className={cs(style.call_btn)}>
            <Button
              type="button"
              color="secondary"
              size="very-small"
              onClick={handleClickAccept}
              state={acceptState}
            >
              accept
            </Button>
          </div>
        ) : null}
      </div>
    </div>
  )
}

export const OfferMobile = memo(_OfferMobile)
