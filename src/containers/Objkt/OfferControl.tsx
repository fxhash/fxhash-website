// import style from "./PlaceOffer.module.scss"
import { useContext } from "react"
import { Objkt } from "../../types/entities/Objkt"
import { User } from "../../types/entities/User"
import { UserContext } from "../UserProvider"
import { CancelOffer } from "./CancelOffer"
import { PlaceOffer } from "./PlaceOffer"


interface Props {
  objkt: Objkt
}

/**
 * This component should:
 *  - if user is owner:
 *    - has activeListing ? cancel activeListing
 *    - doesn't have activeListing ? place activeListing
 */
export function OfferControl({ objkt }: Props) {
  const userCtx = useContext(UserContext)
  const user = userCtx.user!
  const owner: User = objkt.owner!

  return (
    <>
      {owner.id === user.id ? (
        objkt.activeListing ? (
          <CancelOffer
            listing={objkt.activeListing}
            objkt={objkt}
          />
        ):(
          <PlaceOffer objkt={objkt} />
        )
      ):null}
    </>
  )
}