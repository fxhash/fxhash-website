import type { BigNumber } from "bignumber.js"
import { TInputMintIssuer } from "../../services/parameters-builder/mint-issuer/input"
import { TInputPricingDetails } from "../../services/parameters-builder/pricing/input"
import { transformPricingBigNumber } from "./pricings"

export function transformMintIssuerBigNumbers(
  bnInput: TInputMintIssuer<BigNumber, TInputPricingDetails<BigNumber>>
): TInputMintIssuer<number, TInputPricingDetails<number>> {
  return {
    amount: bnInput.amount.toNumber(),
    enabled: bnInput.enabled,
    metadata: bnInput.metadata,
    pricing: transformPricingBigNumber(bnInput.pricing),
    primary_split: bnInput.primary_split.map(split => ({
      address: split.address,
      pct: split.pct.toNumber(),
    })),
    reserves: bnInput.reserves.map(reserve => ({
      amount: reserve.amount.toNumber(),
      data: reserve.data,
      method_id: reserve.method_id.toNumber(),
    })),
    royalties: bnInput.royalties.toNumber(),
    royalties_split: bnInput.royalties_split.map(split => ({
      address: split.address,
      pct: split.pct.toNumber(),
    })),
    tags: bnInput.tags.map(tag => tag.toNumber()),
  }
}