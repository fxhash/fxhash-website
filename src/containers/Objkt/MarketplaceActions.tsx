// import style from "./PlaceOffer.module.scss"
import { useContext, useMemo } from "react"
import { Objkt } from "../../types/entities/Objkt"
import { Offer } from "../../types/entities/Offer"
import { User } from "../../types/entities/User"
import { UserContext } from "../UserProvider"
import { ListingCancel } from "./ListingCancel"
import { ListingCreate } from "./ListingCreate"
import { OfferCancel } from "./OfferCancel"
import { OfferCreate } from "./OfferCreate"


interface Props {
  objkt: Objkt
}

/**
 * This component should:
 *  - if user is owner:
 *    - has activeListing ? cancel activeListing
 *    - doesn't have activeListing ? place activeListing
 */
export function MarketplaceActions({ objkt }: Props) {
  const userCtx = useContext(UserContext)
  const user = userCtx.user!
  const owner: User = objkt.owner!

  // check if the user has an active offer on the token
  const activeOffer = useMemo<Offer|null>(
    () => objkt.offers?.find(offer => offer.buyer.id === user.id) || null,
    [user, objkt]
  )

  return (
    <>
      {owner.id === user.id ? (
        objkt.activeListing ? (
          <ListingCancel
            listing={objkt.activeListing}
            objkt={objkt}
          />
        ):(
          <ListingCreate objkt={objkt} />
        )
      ):null}

      {owner.id !== user.id && (
        activeOffer ? (
          <OfferCancel
            offer={activeOffer}
            objkt={objkt}
          />
        ):(
          <OfferCreate
            objkt={objkt}
          />
        )
      )}
    </>
  )
}