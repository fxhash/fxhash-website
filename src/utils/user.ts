import { User, UserItems } from "../types/entities/User"
import { truncateMiddle } from "./strings"

export function userHasName(user: User): boolean {
  return !!(user.name && user.name.length>0)
}

/**
 * if user has a name, then url uses its name, otherwise it uses its tkh
 */
export function getUserProfileLink(user: User): string {
  return userHasName(user) 
    ? `/u/${encodeURIComponent(user.name!)}`
    : `/pkh/${user.id}`
}

/**
 * Given a user, returns its name. If user doesn't have a name or if name is empty,
 * then returns its pkh but truncated in the middle, with triple dots
 */
export function getUserName(user: User, truncateLength?: number): string {
  return userHasName(user) 
    ? user.name! 
    : (truncateLength ? truncateMiddle(user.id, truncateLength) : user.id)
}

/**
 * Given a User object, outputs its creations, collection, offers and activity,
 * by applying some filters due to how the data is stored. (For instance, if
 * user puts zn objkt for sale, he's not the owner anymore, so we have to
 * find it in the offers)
 */
export function processUserItems(user: User): UserItems {
  const items: UserItems = {
    // straghtforward
    generativeTokens: user.generativeTokens && [...user.generativeTokens],
    // will have to be completed afterwards
    objkts: user.objkts && [...user.objkts],
    // straight
    offers: user.offers,
    // combine actions
    actions: (user.actionsAsIssuer ? [...user.actionsAsIssuer]: [])
  }

  // process objkts in offers
  items.objkts = items.objkts?.concat(user.offers.map(offer => ({...offer.objkt, offer: offer })))
  // remove objkts if they have an offer with a different user
  items.objkts = items.objkts?.filter(objkt => !objkt.offer || (objkt.offer.issuer.id === user.id))
  // process actions as target
  if (user.actionsAsIssuer) {
    items.actions = items.actions?.concat([...user.actionsAsTarget])
  }

  // finally a sorting pass on objkts and actions
  items.objkts = items.objkts?.sort((a, b) => b.createdAt > a.createdAt ? 1 : -1)
  items.actions = items.actions?.sort((a, b) => b.createdAt > a.createdAt ? 1 : -1)

  return items
}