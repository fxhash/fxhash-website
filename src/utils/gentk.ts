import { FxhashContracts } from "../types/Contracts"
import { DeepPartial } from "../types/DeepPartial"
import { GenerativeToken } from "../types/entities/GenerativeToken"
import { Objkt } from "../types/entities/Objkt"
import { User } from "../types/entities/User"
import { ObjktMetadata } from "../types/Metadata"

export function getGentkUrl(gentk: Objkt): string {
  return gentk.slug ? `/gentk/slug/${gentk.slug}` : `/gentk/${gentk.id}`
}


export const fakeGentk: DeepPartial<Objkt> = {
  id: 0,
  name: "[WAITING TO BE SIGNED]",
  owner: {
    id: "tz1gjftp2aoEkC4xvRfNNkPjcfF2fStESgwo",
    name: "fxhash",
    avatarUri: "ipfs://QmURUAU4YPa6Wwco3JSVrcN7WfCrFBZH7hY51BLrc87WjM"
  },
  metadata: {
    name: "[WAITING TO BE SIGNED]",
    description: "This Gentk is waiting to be signed by Fxhash Signer module",
    artifactUri: "ipfs://QmdGV3UqJqX4v5x9nFcDYeekCEAm3SDXUG5SHdjKQKn4Pe",
    displayUri: "ipfs://QmYwSwa5hP4346GqD7hAjutwJSmeYTdiLQ7Wec2C7Cez1D",
    thumbnailUri: "ipfs://QmbvEAn7FLMeYBDroYwBP8qWc3d3VVWbk19tTB83LCMB5S",
    symbol: "GENTK",
    decimals: 0
  },
  iteration: 37,
  activeListing: null,
  issuer: {
    author: {
      id: "tz1PADW67gHdeXY8mxmM13vn7V7oXvW8MgPr",
      name: "Eltono",
      avatarUri: "ipfs://QmaAH6byCkjJiki3Q1gx9jdShR2DdP6gCzK2Mk3rx3m3Gx"
    },
  },
  rarity: null,
  duplicate: false
}

export function getGentkFA2Contract(gentk: Objkt): string {
  if (gentk.version === 0) {
    return FxhashContracts.GENTK_V1
  }
  else {
    return FxhashContracts.GENTK_V2
  }
}