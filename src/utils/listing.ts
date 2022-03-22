import { FxhashContract } from "../types/Contracts"
import { Listing } from "../types/entities/Listing"


export function getListingFA2Contract(listing: Listing): FxhashContract {
  if (listing.version === 0) {
    return FxhashContract.MARKETPLACE_V1
  }
  else {
    return FxhashContract.MARKETPLACE_V2
  }
}

export function getListingCancelEp(listing: Listing): string {
  if (listing.version === 0) {
    return "cancel_offer"
  }
  else {
    return "listing_cancel"
  }
}

export function getListingAcceptEp(listing: Listing): string {
  if (listing.version === 0) {
    return "collect"
  }
  else {
    return "listing_accept"
  }
}