import type { BigNumber } from "bignumber.js"
import { TInputUpdateIssuer } from "../../services/parameters-builder/update-issuer/input"

export function transformUpdateIssuerBigNumbers(
  bnInput: TInputUpdateIssuer<BigNumber>
): TInputUpdateIssuer<number> {
  return {
    issuer_id: bnInput.issuer_id.toNumber(),
    enabled: bnInput.enabled,
    primary_split: bnInput.primary_split.map((split) => ({
      address: split.address,
      pct: split.pct.toNumber(),
    })),
    royalties: bnInput.royalties.toNumber(),
    royalties_split: bnInput.royalties_split.map((split) => ({
      address: split.address,
      pct: split.pct.toNumber(),
    })),
  }
}
