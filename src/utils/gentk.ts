import { Redeemable } from "types/entities/Redeemable"
import { FxhashContracts } from "../types/Contracts"
import { DeepPartial } from "../types/DeepPartial"
import { Objkt } from "../types/entities/Objkt"

export function getGentkUrl(gentk: Objkt): string {
  return gentk.slug ? `/gentk/slug/${gentk.slug}` : `/gentk/${gentk.id}`
}

export const fakeGentk: DeepPartial<Objkt> = {
  id: "0",
  name: "[WAITING TO BE SIGNED]",
  owner: {
    id: "tz1fepn7jZsCYBqCDhpM63hzh9g2Ytqk4Tpv",
    name: "fxhash",
    avatarUri: "ipfs://QmURUAU4YPa6Wwco3JSVrcN7WfCrFBZH7hY51BLrc87WjM",
  },
  metadata: {
    name: "[WAITING TO BE SIGNED]",
    description: "This Gentk is waiting to be signed by Fxhash Signer module",
    artifactUri: "ipfs://QmdGV3UqJqX4v5x9nFcDYeekCEAm3SDXUG5SHdjKQKn4Pe",
    displayUri: "ipfs://QmYwSwa5hP4346GqD7hAjutwJSmeYTdiLQ7Wec2C7Cez1D",
    thumbnailUri: "ipfs://QmbvEAn7FLMeYBDroYwBP8qWc3d3VVWbk19tTB83LCMB5S",
    symbol: "GENTK",
    decimals: 0,
  },
  iteration: 37,
  activeListing: null,
  issuer: {
    author: {
      id: "tz1fepn7jZsCYBqCDhpM63hzh9g2Ytqk4Tpv",
      name: "fxhash",
      avatarUri: "ipfs://QmURUAU4YPa6Wwco3JSVrcN7WfCrFBZH7hY51BLrc87WjM",
    },
  },
  rarity: null,
  duplicate: false,
}

export function getGentkFA2Contract(gentk: Objkt): string {
  if (gentk.version === 0) {
    return FxhashContracts.GENTK_V1
  } else if (gentk.version === 1) {
    return FxhashContracts.GENTK_V2
  } else {
    return FxhashContracts.GENTK_V3
  }
}

/**
 * Given a gentk, outputs a list of Redeemables for which the Gentk can be
 * redeemed, based on the Generative Token redeemables state and the Gentk
 * Redemptions
 */
export function gentkRedeemables(gentk: Objkt): Redeemable[] {
  // filter redeemables to see which are still available based on redemptions
  return gentk.issuer.redeemables.filter((redeemable) => {
    const redemptions = gentk.redemptions.filter(
      (r) => r.redeemable.address === redeemable.address
    )
    return redemptions.length < redeemable.maxConsumptionsPerToken
  })
}
