import { ContractAbstraction, OpKind, Wallet, WalletOperation } from "@taquito/taquito"
import { FxhashContracts } from "../../types/Contracts"
import { Objkt } from "../../types/entities/Objkt"
import { Offer } from "../../types/entities/Offer"
import { getGentkFA2Contract } from "../../utils/gentk"
import { displayMutez } from "../../utils/units"
import { buildParameters, EBuildableParams } from "../parameters-builder/BuildParameters"
import { ContractOperation } from "./ContractOperation"

export type TOfferAcceptOperationParams = {
  offer: Offer
  token: Objkt
  price: number
}

/**
 * List a gentk on the Marketplace
 */
export class OfferAcceptOperation extends ContractOperation<TOfferAcceptOperationParams> {
  gentkContract: ContractAbstraction<Wallet>|null = null
  marketplaceContract: ContractAbstraction<Wallet>|null = null

  async prepare() {
    this.gentkContract = await this.manager.getContract(
      getGentkFA2Contract(this.params.token)
    )
    this.marketplaceContract = await this.manager.getContract(
      FxhashContracts.MARKETPLACE_V2
    )
  }

  async call(): Promise<WalletOperation> {
    const updateOperatorsParams = [{
      add_operator: {
        owner: this.params.token.owner!.id,
        operator: FxhashContracts.MARKETPLACE_V2,
        token_id: this.params.token.id,
      }
    }]

    const offerAcceptParams = this.params.offer.id

    return this.manager.tezosToolkit.wallet.batch()
      .with([
        {
          kind: OpKind.TRANSACTION,
          to: getGentkFA2Contract(this.params.token),
          amount: 0,
          parameter: {
            entrypoint: "update_operators",
            value: buildParameters(
              updateOperatorsParams,
              EBuildableParams.UPDATE_OPERATORS
            )
          },
          storageLimit: 300,
        },
        {
          kind: OpKind.TRANSACTION,
          to: FxhashContracts.MARKETPLACE_V2,
          amount: 0,
          parameter: {
            entrypoint: "offer_accept",
            value: offerAcceptParams
          },
          storageLimit: 450
        }
      ])
      .send()
  }

  success(): string {
    return `You have accepted the offer on ${this.params.token.name} for ${displayMutez(this.params.price)} tez`
  }
}