import { ContractAbstraction, OpKind, Wallet, WalletOperation } from "@taquito/taquito"
import { Listing } from "../../types/entities/Listing"
import { Objkt } from "../../types/entities/Objkt"
import { getListingAcceptEp, getListingFA2Contract } from "../../utils/listing"
import { displayMutez } from "../../utils/units"
import { ContractOperation } from "./ContractOperation"

export type TListingAcceptOperationParams = {
  listing: Listing
  objkt: Objkt
}

/**
 * List a gentk on the Marketplace
 */
export class ListingAcceptOperation extends ContractOperation<TListingAcceptOperationParams> {
  marketplaceContract?: ContractAbstraction<Wallet>
  entrypoint?: string

  async prepare() {
    this.marketplaceContract = await this.manager.getContract(
      getListingFA2Contract(this.params.listing)
    )
    this.entrypoint = getListingAcceptEp(this.params.listing)
  }

  async call(): Promise<WalletOperation> {
    return this.marketplaceContract!.methods[this.entrypoint!](
      this.params.listing.id
    ).send({
      amount: this.params.listing.price,
      mutez: true
    })
  }

  success(): string {
    return `You have bought ${this.params.objkt.name} for ${displayMutez(this.params.listing.price)} tez`
  }
}