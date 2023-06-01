import {
  ContractAbstraction,
  OpKind,
  Wallet,
  WalletOperation,
  WalletParamsWithKind,
} from "@taquito/taquito"
import { Listing } from "../../types/entities/Listing"
import { Objkt } from "../../types/entities/Objkt"
import { getListingCancelEp, getListingFA2Contract } from "../../utils/listing"
import { ContractOperation } from "./ContractOperation"
import {
  buildParameters,
  EBuildableParams,
} from "../parameters-builder/BuildParameters"

export type TListingCancelOperationParams = {
  listing: Listing
  objkt: Objkt
}

/**
 * List a gentk on the Marketplace
 */
export class ListingCancelOperation extends ContractOperation<TListingCancelOperationParams> {
  contract: ContractAbstraction<Wallet> | null = null
  ep: string = ""

  static generateOp(listing: Listing): WalletParamsWithKind {
    return {
      kind: OpKind.TRANSACTION,
      to: getListingFA2Contract(listing),
      amount: 0,
      parameter: {
        entrypoint: getListingCancelEp(listing),
        value: buildParameters(listing!.id, EBuildableParams.LISTING_CANCEL),
      },
      storageLimit: 150,
    }
  }

  async prepare() {
    this.contract = await this.manager.getContract(
      getListingFA2Contract(this.params.listing)
    )
    this.ep = getListingCancelEp(this.params.listing)
  }

  async call(): Promise<WalletOperation> {
    return this.contract!.methodsObject[this.ep](this.params.listing.id).send()
  }

  success(): string {
    return `You have cancelled your listing for ${this.params.objkt.name}`
  }
}
