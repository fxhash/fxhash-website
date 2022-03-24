import type { MichelsonV1Expression } from "@taquito/rpc"
import updateOperatorsType from "./update-operators/type.json"
import listingType from "./listing/type.json"
import listingCancelType from "./listing-cancel/type.json"
import listingAcceptType from "./listing-accept/type.json"
import mintIssuerType from "./mint-issuer/type.json"
import pricingFixedType from "./pricing-fixed/type.json"
import { Schema } from "@taquito/michelson-encoder"
import { packData, packDataBytes, unpackDataBytes } from "@taquito/michel-codec"

/**
 * An Enumeration of the different parameter builders available
 */
export enum EBuildableParams {
  UPDATE_OPERATORS      = "UPDATE_OPERATORS",
  LISTING               = "LISTING",
  LISTING_CANCEL        = "LISTING_CANCEL",
  LISTING_ACCEPT        = "LISTING_ACCEPT",
  MINT_ISSUER           = "MINT_ISSUER",
  PRICING_FIXED         = "PRICING_FIXED",
}

// maps a builadable param type with the actual type in json
const buildableParamTypes: Record<EBuildableParams, MichelsonV1Expression> = {
  UPDATE_OPERATORS: updateOperatorsType,
  LISTING: listingType,
  LISTING_CANCEL: listingCancelType,
  LISTING_ACCEPT: listingAcceptType,
  MINT_ISSUER: mintIssuerType,
  PRICING_FIXED: pricingFixedType,
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