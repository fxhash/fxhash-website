import { OpKind, WalletOperation, WalletParamsWithKind } from "@taquito/taquito"
import { getGentkLocalID } from "utils/entities/gentk"
import { FxhashContracts } from "../../types/Contracts"
import { Objkt } from "../../types/entities/Objkt"
import { CollectionOffer, Offer } from "../../types/entities/Offer"
import { getGentkFA2Contract } from "../../utils/gentk"
import { getListingCancelEp, getListingFA2Contract } from "../../utils/listing"
import { displayMutez } from "../../utils/units"
import {
  buildParameters,
  EBuildableParams,
} from "../parameters-builder/BuildParameters"
import { ContractOperation } from "./ContractOperation"

export type TCollectionOfferAcceptOperationParams = {
  offer: CollectionOffer
  token: Objkt
  price: number
}

/**
 * Accept a collection offer on the Marketplace
 */
export class CollectionOfferAcceptOperation extends ContractOperation<TCollectionOfferAcceptOperationParams> {
  async prepare() {}

  async call(): Promise<WalletOperation> {
    const updateOperatorsParams = [
      {
        add_operator: {
          owner: this.params.token.owner!.id,
          operator: FxhashContracts.MARKETPLACE_V2,
          token_id: getGentkLocalID(this.params.token.id),
        },
      },
    ]

    // the list of operationd
    const operations: WalletParamsWithKind[] = []

    const collectionOfferAcceptParams = {
      gentk: {
        id: getGentkLocalID(this.params.token.id),
        version: this.params.token.version,
      },
      offer_id: this.params.offer.id,
    }

    // if there's an active listing, it must first be cancelled
    if (this.params.token.activeListing) {
      operations.push({
        kind: OpKind.TRANSACTION,
        to: getListingFA2Contract(this.params.token.activeListing),
        amount: 0,
        parameter: {
          entrypoint: getListingCancelEp(this.params.token.activeListing),
          value: buildParameters(
            this.params.token.activeListing.id,
            EBuildableParams.LISTING_CANCEL
          ),
        },
        storageLimit: 150,
      })
    }

    // add the marketplace v2 as an operator
    operations.push({
      kind: OpKind.TRANSACTION,
      to: getGentkFA2Contract(this.params.token),
      amount: 0,
      parameter: {
        entrypoint: "update_operators",
        value: buildParameters(
          updateOperatorsParams,
          EBuildableParams.UPDATE_OPERATORS
        ),
      },
      storageLimit: 300,
    })

    // accept the offer
    operations.push({
      kind: OpKind.TRANSACTION,
      to: FxhashContracts.MARKETPLACE_V2,
      amount: 0,
      parameter: {
        entrypoint: "collection_offer_accept",
        value: buildParameters(
          collectionOfferAcceptParams,
          EBuildableParams.COLLECTION_OFFER_ACCEPT
        ),
      },
      storageLimit: 450,
    })

    return this.manager.tezosToolkit.wallet.batch().with(operations).send()
  }

  success(): string {
    return `You have accepted the offer on ${
      this.params.token.name
    } for ${displayMutez(this.params.price)} tez`
  }
}
