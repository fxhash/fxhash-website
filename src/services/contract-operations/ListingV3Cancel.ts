import { ContractAbstraction, Wallet, WalletOperation } from "@taquito/taquito"
import { FxhashContracts } from "../../types/Contracts"
import { NFTArticle } from "../../types/entities/Article"
import { Listing } from "../../types/entities/Listing"
import { displayMutez } from "../../utils/units"
import { ContractOperation } from "./ContractOperation"

export type TListingV3CancelOperationParams = {
  listing: Listing
  article: NFTArticle
}

/**
 * List a gentk on the Marketplace
 */
export class ListingV3CancelOperation extends ContractOperation<TListingV3CancelOperationParams> {
  contract: ContractAbstraction<Wallet> | null = null
  ep: string = ""

  async prepare() {
    this.contract = await this.manager.getContract(
      FxhashContracts.MARKETPLACE_V3
    )
  }

  async call(): Promise<WalletOperation> {
    return this.contract!.methodsObject.listing_cancel(
      this.params.listing.id
    ).send()
  }

  success(): string {
    return `You have cancelled your listing of ${
      this.params.listing.amount
    } editions for ${displayMutez(this.params.listing.price)} tez each on ${
      this.params.article.title
    }`
  }
}
