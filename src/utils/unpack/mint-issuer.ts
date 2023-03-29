import type { BigNumber } from "bignumber.js"
import {
  EBuildableParams,
  unpackBytes,
} from "../../services/parameters-builder/BuildParameters"
import { TInputMintIssuer } from "../../services/parameters-builder/mint-issuer/input"
import { TInputPricingDetails } from "../../services/parameters-builder/pricing/input"
import { transformMintIssuerBigNumbers } from "../unpack-transformers/mint-issuer"
import { unpackPricingDetails } from "./pricing"
import { unpackReserve } from "./reserve"

export function unpackMintIssuer(
  bytes: string,
  type: EBuildableParams = EBuildableParams.MINT_ISSUER
): TInputMintIssuer<number, TInputPricingDetails<number>> {
  // unpack (get BigNumbers)
  const unpacked = unpackBytes<TInputMintIssuer<BigNumber, string>>(bytes, type)

  // unpack the pricing too (still big numbers)
  const withPricingUnpacked: TInputMintIssuer<
    BigNumber,
    TInputPricingDetails<BigNumber>
  > = {
    ...unpacked,
    pricing: {
      pricing_id: unpacked.pricing.pricing_id,
      details: unpackPricingDetails(unpacked.pricing),
      lock_for_reserves: false,
    },
  }

  // turns all the BigNumbers into JS numbers to consume easily
  const numbered = transformMintIssuerBigNumbers(withPricingUnpacked)

  // unpack reserves too
  const withReservesUnpacked = {
    ...numbered,
    reserves: numbered.reserves.map((reserve) => unpackReserve(reserve)),
  }

  return withReservesUnpacked as any
}
