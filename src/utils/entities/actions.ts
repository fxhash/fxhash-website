import { Action, TokenActionType } from "../../types/entities/Action";
import { User } from "../../types/entities/User";

/**
 * Given the type of the action, outputs the buyer
 */
export function getActionBuyer(action: Action): User {
  return action.type === TokenActionType.OFFER_ACCEPTED
    ? action.target!
    : action.issuer!
}

/**
 * Given the type of the action, outputs the seller
 */
 export function getActionSeller(action: Action): User {
  return action.type === TokenActionType.OFFER_ACCEPTED
    ? action.issuer!
    : action.target!
}