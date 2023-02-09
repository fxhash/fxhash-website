import { EWalletOperations } from "../services/Wallet"

/**
 * Given a wallet operation, returns the text that corresponds
 */
export function getWalletOperationText(op: EWalletOperations): string {
  switch (op) {
    case EWalletOperations.BAN_USER:
      return "ban user"
    case EWalletOperations.BURN_GENERATIVE:
      return "burn generative token"
    case EWalletOperations.BURN_GENERATIVE_SUPPLY:
      return "burn generative token supply"
    case EWalletOperations.CANCEL_LISTING:
      return "cancel listing"
    case EWalletOperations.COLLECT:
      return "collect token"
    case EWalletOperations.LIST_TOKEN:
      return "list token"
    case EWalletOperations.MINT_ITERATION:
      return "mint unique iteration"
    case EWalletOperations.MODERATE_TOKEN:
      return "moderate token"
    case EWalletOperations.MODERATE_USER:
      return "moderate user"
    case EWalletOperations.PUBLISH_GENERATIVE:
      return "publish new generative token"
    case EWalletOperations.REPORT:
      return "report generative token"
    case EWalletOperations.UPDATE_GENERATIVE:
      return "update generative token"
    case EWalletOperations.UPDATE_PROFILE:
      return "update user profile"
    case EWalletOperations.VERIFY_USER:
      return "verify user"
    default:
      return "unknown operation"
  }
}
