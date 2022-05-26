// import style from "./PlaceOffer.module.scss"
import { useContext } from "react"
import { Objkt } from "../../types/entities/Objkt"
import { User } from "../../types/entities/User"
import { UserContext } from "../UserProvider"
import { ListingCancel } from "./ListingCancel"
import { ListingCreate } from "./ListingCreate"


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
    </>
  )
}