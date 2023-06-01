import { OpKind, WalletOperation, WalletParamsWithKind } from "@taquito/taquito"
import { Objkt } from "../../types/entities/Objkt"
import { displayMutez } from "../../utils/units"
import { ContractOperation } from "./ContractOperation"
import { ListingCancelOperation } from "./ListingCancel"
import { ListingOperation } from "./Listing"

export type TListingUpsertOperationParams = {
  token: Objkt
  price: number
}

/**
 * Update or insert a gentk listing on the Marketplace
 */
export class ListingUpsertOperation extends ContractOperation<TListingUpsertOperationParams> {
  async prepare() {}

  async call(): Promise<WalletOperation> {
    const { token, price } = this.params
    const ops: WalletParamsWithKind[] = []
    if (token.activeListing) {
      ops.push(ListingCancelOperation.generateOp(token.activeListing))
    }
    ops.push(...ListingOperation.generateOps(token, price))
    return this.manager.tezosToolkit.wallet.batch().with(ops).send()
  }

  success(): string {
    const { token, price: newPrice } = this.params
    return token.activeListing
      ? `You have updated ${token.name} price: ${displayMutez(
          token.activeListing.price
        )} => ${displayMutez(newPrice)} tez`
      : `You have listed ${token.name} for ${displayMutez(newPrice)} tez`
  }
}
