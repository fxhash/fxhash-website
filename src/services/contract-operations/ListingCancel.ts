import {
  ContractAbstraction,
  OpKind,
  Wallet,
  WalletOperation,
} from "@taquito/taquito"
import { FxhashContracts } from "../../types/Contracts"
import { Listing } from "../../types/entities/Listing"
import { Objkt } from "../../types/entities/Objkt"
import { getListingCancelEp, getListingFA2Contract } from "../../utils/listing"
import {
  buildParameters,
  EBuildableParams,
} from "../parameters-builder/BuildParameters"
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
  contract: ContractAbstraction<Wallet> | null = null
  ep: string = ""

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
