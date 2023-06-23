import { ContractAbstraction, Wallet, WalletOperation } from "@taquito/taquito"
import { GenerativeToken } from "types/entities/GenerativeToken"
import { FxhashContracts } from "../../types/Contracts"
import { CollectionOffer } from "../../types/entities/Offer"
import { displayMutez } from "../../utils/units"
import { ContractOperation } from "./ContractOperation"

export type TCollectionOfferCancelOperationParams = {
  offer: CollectionOffer
  token: GenerativeToken
}

/**
 * Withdraw a collection offer from the Marketplace
 */
export class CollectionOfferCancelOperation extends ContractOperation<TCollectionOfferCancelOperationParams> {
  contract: ContractAbstraction<Wallet> | null = null

  async prepare() {
    this.contract = await this.manager.getContract(
      FxhashContracts.MARKETPLACE_V2
    )
  }

  async call(): Promise<WalletOperation> {
    return this.contract!.methodsObject.collection_offer_cancel(
      this.params.offer.id
    ).send()
  }

  success(): string {
    return `You have cancelled your collection offer of ${displayMutez(
      this.params.offer.price
    )} on ${this.params.token.name}`
  }
}
