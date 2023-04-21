import { ContractAbstraction, Wallet, WalletOperation } from "@taquito/taquito"
import { GenerativeToken } from "types/entities/GenerativeToken"
import { FxhashContracts } from "../../types/Contracts"
import { displayMutez } from "../../utils/units"
import { ContractOperation } from "./ContractOperation"

export type TCollectionOfferOperationParams = {
  token: GenerativeToken
  amount: number
  price: number
}

/**
 * Create a collection offer on the Marketplace
 */
export class CollectionOfferOperation extends ContractOperation<TCollectionOfferOperationParams> {
  marketplaceContract: ContractAbstraction<Wallet> | null = null

  async prepare() {
    this.marketplaceContract = await this.manager.getContract(
      FxhashContracts.MARKETPLACE_V2
    )
  }

  async call(): Promise<WalletOperation> {
    return this.marketplaceContract!.methodsObject.collection_offer({
      amount: this.params.amount,
      collection: this.params.token.id,
      price: this.params.price,
    }).send({
      mutez: true,
      amount: this.params.price * this.params.amount,
    })
  }

  success(): string {
    return `You have made a collection offer of ${displayMutez(
      this.params.price
    )} tez on ${this.params.token.name}`
  }
}
