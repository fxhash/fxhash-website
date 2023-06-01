import { OpKind, WalletOperation, WalletParamsWithKind } from "@taquito/taquito"
import { getGentkLocalIDFromObjkt } from "utils/entities/gentk"
import { FxhashContracts } from "../../types/Contracts"
import { Objkt } from "../../types/entities/Objkt"
import { getGentkFA2Contract } from "../../utils/gentk"
import { displayMutez } from "../../utils/units"
import {
  buildParameters,
  EBuildableParams,
} from "../parameters-builder/BuildParameters"
import { ContractOperation } from "./ContractOperation"

export type TListingOperationParams = {
  token: Objkt
  price: number
}

/**
 * List a gentk on the Marketplace
 */
export class ListingOperation extends ContractOperation<TListingOperationParams> {
  static generateOps(objkt: Objkt, price: number): WalletParamsWithKind[] {
    // recent V3 tokens have an ID of "FXN-{id}", so we need to extract the ID
    // part only for these recent tokens
    const id = getGentkLocalIDFromObjkt(objkt)
    const updateOperatorsParams = [
      {
        add_operator: {
          owner: objkt.owner!.id,
          operator: FxhashContracts.MARKETPLACE_V2,
          token_id: id,
        },
      },
    ]

    const listingParams = {
      gentk: {
        id: id,
        version: objkt.version,
      },
      price,
    }

    return [
      {
        kind: OpKind.TRANSACTION,
        to: getGentkFA2Contract(objkt),
        amount: 0,
        parameter: {
          entrypoint: "update_operators",
          value: buildParameters(
            updateOperatorsParams,
            EBuildableParams.UPDATE_OPERATORS
          ),
        },
        storageLimit: 300,
      },
      {
        kind: OpKind.TRANSACTION,
        to: FxhashContracts.MARKETPLACE_V2,
        amount: 0,
        parameter: {
          entrypoint: "listing",
          value: buildParameters(listingParams, EBuildableParams.LISTING),
        },
        storageLimit: 450,
      },
    ]
  }
  async prepare() {}

  async call(): Promise<WalletOperation> {
    return this.manager.tezosToolkit.wallet
      .batch()
      .with(ListingOperation.generateOps(this.params.token, this.params.price))
      .send()
  }

  success(): string {
    return `You have listed ${this.params.token.name} for ${displayMutez(
      this.params.price
    )} tez`
  }
}
