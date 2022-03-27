import { OpKind, WalletOperation } from "@taquito/taquito"
import { Listing } from "../../types/entities/Listing"
import { Objkt } from "../../types/entities/Objkt"
import { getListingCancelEp, getListingFA2Contract } from "../../utils/listing"
import { buildParameters, EBuildableParams } from "../parameters-builder/BuildParameters"
import { TInputListingCancel } from "../parameters-builder/listing-cancel/input"
import { ContractOperation } from "./ContractOperation"

export type TListingCancelOperationParams = {
  listing: Listing
  objkt: Objkt
}

/**
 * List a gentk on the Marketplace
 */
export class ListingCancelOperation extends ContractOperation<TListingCancelOperationParams> {
  async prepare() {}

  async call(): Promise<WalletOperation> {
    console.log(this.params)
    const listingCancelParams = buildParameters<TInputListingCancel>(
      this.params.listing.id, 
      EBuildableParams.LISTING_CANCEL
    )

    return this.manager.tezosToolkit.wallet.batch() 
      .with([
        {
          kind: OpKind.TRANSACTION,
          to: getListingFA2Contract(this.params.listing),
          fee: 1500,
          amount: 0,
          parameter: {
            entrypoint: getListingCancelEp(this.params.listing),
            value: listingCancelParams,
          },
          gasLimit: 10000,
          storageLimit: 0,
        },
      ])
      .send()
  }

  success(): string {
    return `You have cancelled your listing for ${this.params.objkt.name}`
  }
}