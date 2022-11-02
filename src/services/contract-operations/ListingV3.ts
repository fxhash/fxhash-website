import { ContractAbstraction, OpKind, Wallet, WalletOperation } from "@taquito/taquito"
import { FxhashContracts } from "../../types/Contracts"
import { NFTArticle } from "../../types/entities/Article"
import { Objkt } from "../../types/entities/Objkt"
import { User } from "../../types/entities/User"
import { getGentkFA2Contract } from "../../utils/gentk"
import { displayMutez } from "../../utils/units"
import { buildParameters, EBuildableParams } from "../parameters-builder/BuildParameters"
import { ContractOperation } from "./ContractOperation"

export type TListingV3OperationParams = {
  article: NFTArticle
  amount: string
  price: string
  owner: User
}

/**
 * List an asset on the marketplace V3
 * todo: add support for other asset types
 */
export class ListingV3Operation extends ContractOperation<TListingV3OperationParams> {
  articleContract: ContractAbstraction<Wallet>|null = null
  marketplaceContract: ContractAbstraction<Wallet>|null = null

  async prepare() {
    this.articleContract = await this.manager.getContract(
      FxhashContracts.ARTICLES
    )
    this.marketplaceContract = await this.manager.getContract(
      FxhashContracts.MARKETPLACE_V3
    )
  }

  async call(): Promise<WalletOperation> {
    const updateOperatorsParams = [{
      add_operator: {
        owner: this.params.owner.id,
        operator: FxhashContracts.MARKETPLACE_V3,
        token_id: this.params.article.id,
      }
    }]

    const listingParams = {
      asset: {
        amount: this.params.amount,
        asset_id: this.params.article.id,
        // todo: abstract this
        contract_id: 2,
      },
      amount: this.params.price,
      currency: {
        tez: null
      }
    }

    return this.manager.tezosToolkit.wallet.batch()
      .with([
        {
          kind: OpKind.TRANSACTION,
          to: FxhashContracts.ARTICLES,
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
          to: FxhashContracts.MARKETPLACE_V3,
          amount: 0,
          parameter: {
            entrypoint: "listing",
            value: buildParameters(
              listingParams,
              EBuildableParams.LISTING_V3
            )
          },
          storageLimit: 450
        }
      ])
      .send()
  }

  success(): string {
    return `You have listed ${this.params.amount} of ${this.params.article.title}for ${displayMutez(parseInt(this.params.price))} tez each` 
  }
}