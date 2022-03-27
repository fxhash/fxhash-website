import { OpKind, WalletOperation } from "@taquito/taquito"
import { FxhashContracts } from "../../types/Contracts"
import { Objkt } from "../../types/entities/Objkt"
import { getGentkFA2Contract } from "../../utils/gentk"
import { displayMutez } from "../../utils/units"
import { buildParameters, EBuildableParams } from "../parameters-builder/BuildParameters"
import { TInputListing } from "../parameters-builder/listing/input"
import { TInputUpdateOperators } from "../parameters-builder/update-operators/input"
import { ContractOperation } from "./ContractOperation"

export type TListingOperationParams = {
  token: Objkt
  price: number
}

/**
 * List a gentk on the Marketplace
 */
export class ListingOperation extends ContractOperation<TListingOperationParams> {
  async prepare() {}

  async call(): Promise<WalletOperation> {
    const updateOperatorsParams = buildParameters<TInputUpdateOperators>([{
      add_operator: {
        owner: this.params.token.owner!.id,
        operator: FxhashContracts.MARKETPLACE_V2,
        token_id: this.params.token.id,
      }
    }], EBuildableParams.UPDATE_OPERATORS)

    const listingParams = buildParameters<TInputListing>({
      gentk: {
        id: this.params.token.id,
        version: this.params.token.version,
      },
      price: this.params.price,
    }, EBuildableParams.LISTING)

    return this.manager.tezosToolkit.wallet.batch() 
      .with([
        {
          kind: OpKind.TRANSACTION,
          to: getGentkFA2Contract(this.params.token),
          fee: 1000,
          amount: 0,
          parameter: {
            entrypoint: "update_operators",
            value: updateOperatorsParams
          },
          gasLimit: 8000,
          storageLimit: 250,
        },
        {
          kind: OpKind.TRANSACTION,
          to: FxhashContracts.MARKETPLACE_V2,
          fee: 1500,
          amount: 0,
          parameter: {
            entrypoint: "listing",
            value: listingParams,
          },
          gasLimit: 10000,
          storageLimit: 250
        }
      ])
      .send()
  }

  success(): string {
    return `You have listed ${this.params.token.name} for ${displayMutez(this.params.price)} tez`
  }
}