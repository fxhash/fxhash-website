import {
  ContractAbstraction,
  OpKind,
  Wallet,
  WalletOperation,
} from "@taquito/taquito"
import { FxhashContracts } from "../../types/Contracts"
import { Objkt } from "../../types/entities/Objkt"
import { displayMutez } from "../../utils/units"
import { ContractOperation } from "./ContractOperation"

export type TOfferOperationParams = {
  token: Objkt
  price: number
}

/**
 * List a gentk on the Marketplace
 */
export class OfferOperation extends ContractOperation<TOfferOperationParams> {
  marketplaceContract: ContractAbstraction<Wallet> | null = null

  async prepare() {
    this.marketplaceContract = await this.manager.getContract(
      FxhashContracts.MARKETPLACE_V2
    )
  }

  async call(): Promise<WalletOperation> {
    return this.marketplaceContract!.methodsObject.offer({
      gentk: {
        id: this.params.token.id,
        version: this.params.token.version,
      },
      price: this.params.price,
    }).send({
      mutez: true,
      amount: this.params.price,
    })
  }

  success(): string {
    return `You have made an offer of ${displayMutez(
      this.params.price
    )} tez on ${this.params.token.name}`
  }
}
