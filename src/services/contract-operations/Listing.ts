import { ContractAbstraction, OpKind, Wallet, WalletOperation } from "@taquito/taquito"
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

    const listingParams = {
      gentk: {
        id: this.params.token.id,
        version: this.params.token.version,
      },
      price: this.params.price,
    }

    return this.manager.tezosToolkit.wallet.batch() 
      .withContractCall(
        this.gentkContract!.methodsObject.update_operators(
          updateOperatorsParams
        )
      )
      .withContractCall(
        this.marketplaceContract!.methodsObject.listing(
          listingParams
        )
      )
      .send()
  }

  success(): string {
    return `You have listed ${this.params.token.name} for ${displayMutez(this.params.price)} tez`
  }
}