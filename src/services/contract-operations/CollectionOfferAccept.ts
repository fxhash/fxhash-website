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
  tokens: Objkt[]
  price: number
}

/**
 * Accept a collection offer on the Marketplace
 */
export class CollectionOfferAcceptOperation extends ContractOperation<TCollectionOfferAcceptOperationParams> {
  async prepare() {}

  async call(): Promise<WalletOperation> {
    const operations = this.params.tokens.reduce((ops, token) => {
      const updateOperatorsParams = [
        {
          add_operator: {
            owner: token.owner!.id,
            operator: FxhashContracts.MARKETPLACE_V2,
            token_id: getGentkLocalID(token.id),
          },
        },
      ]
      const collectionOfferAcceptParams = {
        gentk: {
          id: getGentkLocalID(token.id),
          version: token.version,
        },
        offer_id: this.params.offer.id,
      }

      // if there's an active listing, it must first be cancelled
      if (token.activeListing) {
        ops.push({
          kind: OpKind.TRANSACTION,
          to: getListingFA2Contract(token.activeListing),
          amount: 0,
          parameter: {
            entrypoint: getListingCancelEp(token.activeListing),
            value: buildParameters(
              token.activeListing.id,
              EBuildableParams.LISTING_CANCEL
            ),
          },
          storageLimit: 150,
        })
      }

      // add the marketplace v2 as an operator
      ops.push({
        kind: OpKind.TRANSACTION,
        to: getGentkFA2Contract(token),
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
      ops.push({
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

      return ops
    }, [] as WalletParamsWithKind[])

    return this.manager.tezosToolkit.wallet.batch().with(operations).send()
  }

  success(): string {
    const [token] = this.params.tokens
    const totalTokens = this.params.tokens.length
    const price = this.params.price * totalTokens
    return `You have accepted the offer on ${token.name} for ${displayMutez(
      price
    )} tez`
  }
}
