import { DisplayTezos } from "components/Display/DisplayTezos"
import { MessageProps } from "components/MessageCenter/Message"
import { ISettingsContext } from "context/Theme"
import { isAfter } from "date-fns"
import Link from "next/link"
import { AnyOffer, Offer, offerTypeGuard } from "types/entities/Offer"
import { ConnectedUser } from "types/entities/User"
import { readCursor, setCursor } from "utils/alerts"
import { getUserProfileLink } from "utils/user"

const OfferAlert = ({
  user,
  newOffers,
  onRemove,
}: {
  user: ConnectedUser
  newOffers: AnyOffer[]
  onRemove: MessageProps["onRemove"]
}) => {
  return (
    <>
      {/* render details of first 2 offers, truncate rest */}
      {newOffers.slice(0, 2).map((offer) => (
        <div key={offer.id}>
          Offer of{" "}
          <b>
            <DisplayTezos mutez={offer.price} />
          </b>{" "}
          for{" "}
          {offerTypeGuard(offer) ? (
            <b>{offer.objkt.name}</b>
          ) : (
            <>
              collection <b>{offer.token.name}</b>
            </>
          )}
        </div>
      ))}
      {newOffers.length > 2 && <div>...{newOffers.length - 2} more</div>}
      <Link
        legacyBehavior
        href={`${getUserProfileLink(user)}/dashboard/offers-received`}
      >
        <a onClick={onRemove}>See my offers</a>
      </Link>
    </>
  )
}

const checkOfferIsRelevant = (offer: AnyOffer, floorThreshold: number) => {
  /**
   * if no floor, use 0 - better to have false positives than miss
   * potentially good offers
   */
  const floor =
    (offerTypeGuard(offer)
      ? offer.objkt.issuer.marketStats?.floor
      : offer.token.marketStats?.floor) || 0
  return offer.price >= floorThreshold * floor
}

export const createOfferAlert = (
  user: ConnectedUser,
  settings: ISettingsContext,
  offers: AnyOffer[]
) => {
  if (!settings.showOfferAlerts) return null

  // use a separate cursor to track when the last offer alert was sent
  const cursor = readCursor(user.id, "offer-cursor")
  // find offers created since the last alert
  const newOffers = offers.filter((offer) =>
    cursor ? isAfter(new Date(offer.createdAt), new Date(cursor)) : true
  )
  // filter offers below floor threshold
  const relevantOffers = newOffers.filter((offer) =>
    checkOfferIsRelevant(offer, settings.offerAlertsFloorThreshold)
  )
  // if none, do nothing
  if (!relevantOffers.length) return null

  // set the user's offer cursor to the current time
  setCursor(user.id, "offer-cursor")

  return {
    type: "warning",
    title: "New offers",
    content: (onRemove: () => void) => (
      <OfferAlert user={user} newOffers={relevantOffers} onRemove={onRemove} />
    ),
    keepAlive: true,
  }
}
