import type { MichelsonV1Expression } from "@taquito/rpc"
import updateOperatorsType from "./update-operators/type.json"
import listingType from "./listing/type.json"
import listingCancelType from "./listing-cancel/type.json"
import listingAcceptType from "./listing-accept/type.json"
import listingV3Type from "./listing-v3/type.json"
// import listingCancelType from "./listing-cancel/type.json"
// import listingAcceptType from "./listing-accept/type.json"
import offerAcceptType from "./offer-accept/type.json"
import collectionOfferAcceptType from "./collection-offer-accept/type.json"
import mintIssuerType from "./mint-issuer/type.json"
import mintIssuerV3Type from "./mint-issuer-v3/type.json"
import mintType from "./mint/type.json"
import mintV3Type from "./mint-v3/type.json"
import pricingFixedType from "./pricing-fixed/type.json"
import pricingDutchAuctionType from "./pricing-dutch-auction/type.json"
import updateIssuerType from "./update-issuer/type.json"
import updatePriceType from "./update-price/type.json"
import updatePriceV3Type from "./update-price-v3/type.json"
import updateReserveType from "./update-reserve/type.json"
import burnSupplyType from "./burn-supply/type.json"
import burnType from "./burn/type.json"
import reserveWhitelistType from "./reserve-whitelist/type.json"
import reserveMintPassType from "./reserve-mint-pass/type.json"
import reserveMintInputType from "./reserve-mint-input/type.json"
import reserveMintPassInputType from "./reserve-mint-pass-input/type.json"
import mintPassConsumeType from "./mint-pass-consume/type.json"
import { Schema } from "@taquito/michelson-encoder"
import { packData, packDataBytes, unpackDataBytes } from "@taquito/michel-codec"

/**
 * An Enumeration of the different parameter builders available
 */
export enum EBuildableParams {
  UPDATE_OPERATORS = "UPDATE_OPERATORS",
  LISTING = "LISTING",
  LISTING_CANCEL = "LISTING_CANCEL",
  LISTING_ACCEPT = "LISTING_ACCEPT",
  LISTING_V3 = "LISTING_V3",
  // LISTING_CANCEL        = "LISTING_CANCEL",
  // LISTING_ACCEPT        = "LISTING_ACCEPT",
  OFFER_ACCEPT = "OFFER_ACCEPT",
  COLLECTION_OFFER_ACCEPT = "COLLECTION_OFFER_ACCEPT",
  MINT = "MINT",
  MINT_V3 = "MINT_V3",
  MINT_ISSUER = "MINT_ISSUER",
  MINT_ISSUER_V3 = "MINT_ISSUER_V3",
  PRICING_FIXED = "PRICING_FIXED",
  PRICING_DUTCH_AUCTION = "PRICING_DUTCH_AUCTION",
  UPDATE_ISSUER = "UPDATE_ISSUER",
  UPDATE_PRICE = "UPDATE_PRICE",
  UPDATE_PRICE_V3 = "UPDATE_PRICE_V3",
  UPDATE_RESERVE = "UPDATE_RESERVE",
  BURN_SUPPLY = "BURN_SUPPLY",
  BURN = "BURN",
  RESERVE_WHITELIST = "RESERVE_WHITELIST",
  RESERVE_MINT_PASS = "RESERVE_MINT_PASS",
  RESERVE_MINT_PASS_INPUT = "RESERVE_MINT_PASS_INPUT",
  RESERVE_MINT_INPUT = "RESERVE_MINT_INPUT",
  MINT_PASS_CONSUME = "MINT_PASS_CONSUME",
}

// maps a builadable param type with the actual type in json
const buildableParamTypes: Record<EBuildableParams, MichelsonV1Expression> = {
  UPDATE_OPERATORS: updateOperatorsType,
  LISTING: listingType,
  LISTING_CANCEL: listingCancelType,
  LISTING_ACCEPT: listingAcceptType,
  LISTING_V3: listingV3Type,
  // LISTING_CANCEL: listingCancelType,
  // LISTING_ACCEPT: listingAcceptType,
  OFFER_ACCEPT: offerAcceptType,
  COLLECTION_OFFER_ACCEPT: collectionOfferAcceptType,
  MINT_ISSUER: mintIssuerType,
  MINT_ISSUER_V3: mintIssuerV3Type,
  MINT: mintType,
  MINT_V3: mintV3Type,
  PRICING_FIXED: pricingFixedType,
  PRICING_DUTCH_AUCTION: pricingDutchAuctionType,
  UPDATE_ISSUER: updateIssuerType,
  UPDATE_PRICE: updatePriceType,
  UPDATE_PRICE_V3: updatePriceV3Type,
  UPDATE_RESERVE: updateReserveType,
  BURN_SUPPLY: burnSupplyType,
  BURN: burnType,
  RESERVE_WHITELIST: reserveWhitelistType,
  RESERVE_MINT_PASS: reserveMintPassType,
  RESERVE_MINT_INPUT: reserveMintInputType,
  RESERVE_MINT_PASS_INPUT: reserveMintPassInputType,
  MINT_PASS_CONSUME: mintPassConsumeType,
}

/**
 * Given some parameters as a JSON js object, and a type to encode to in
 * michelson, outputs the json-michelson representation of the parameters
 * @param params the js object to transform
 * @param type the enum identifier to map the types with
 * @returns michelson version of the encoded parameters
 */
export function buildParameters<T>(params: T, type: EBuildableParams) {
  const schema = new Schema(buildableParamTypes[type])
  return schema.Encode(params)
}

/**
 * Given some packed bytes as input and a type of the bytes, decodes the bytes
 * into a human-readable javascript object which corresponds to the type given
 * as parameter
 */
export function unpackBytes<T = any>(bytes: string, type: EBuildableParams): T {
  const unpacked = unpackDataBytes({ bytes })
  const schema = new Schema(buildableParamTypes[type])
  return schema.Execute(unpacked)
}

/**
 * Given some data to pack represented as a **clean** js object (no extra
 * properties than those allowed by the type) and its corresponding type
 * (identified by its EBuildableParams key enum), outputs the data packed as
 * bytes string, ready to be sent to the contract
 */
export function pack<T = any>(data: any, type: EBuildableParams) {
  // just get the type object
  const A = buildableParamTypes[type]
  // turn js object into its michelson version
  const encoded = buildParameters<T>(data, type)
  // now pack the data, and returns it
  return packDataBytes(encoded, A as any).bytes
}
