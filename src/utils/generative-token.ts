import { TInputMintIssuer } from "../services/parameters-builder/mint-issuer/input"
import { TInputPricingDetails } from "../services/parameters-builder/pricing/input"
import { GenerativeToken, GenTokFlag } from "../types/entities/GenerativeToken"
import { User } from "../types/entities/User"
import { GenerativeTokenMetadata } from "../types/Metadata"

export function getGenerativeTokenUrl(generative: GenerativeToken): string {
  return generative.slug ? `/generative/slug/${generative.slug}` : `/generative/${generative.id}`
}

export function getGenerativeTokenMarketplaceUrl(generative: GenerativeToken): string {
  return `/marketplace/generative/${generative.id}`
}

/**
 * Some "fake" data to be use for a fake Generative Token
 */
export const fakeGenerativeToken: Partial<GenerativeToken> = {
  id: 0,
  name: "FXHASH Generative Logo",
  metadata: {
    name: "FXHASH Generative Logo",
    description: "This Generative Token is the first GT minted on fxhash.\n\nIt also servers as the actual logo of the platform. It represents the generative processes driving fxhash tokens. Generative Tokens are fed with a unique hash to produce unique outputs based on the hash — they are functions with a hash as single input.\n\nThe growth that comes out of the text is driven by a \"Dividing-Aggregating Walkers\" (DAW) algorithm. The hash drives all the DAW settings, as well as a mutation factor which is responsible for changes in each Walker parameters as they divide.\n\nSome iterations will produce very simple outputs whereas others might be more chaotic.\n\nPiece by @ciphrd for fxhash",
    childrenDescription: "Unique iteration of the first Generative Token minted on fxhash.\n\nIt also servers as the actual logo of the platform. It represents the generative processes driving fxhash tokens. Generative Tokens are fed with a unique hash to produce unique outputs based on the hash — they are functions with a hash as single input.\n\nThe growth that comes out of the text is driven by a \"Dividing-Aggregating Walkers\" (DAW) algorithm. The hash drives all the DAW settings, as well as a mutation factor which is responsible for changes in each Walker parameters as they divide.\n\nSome iterations will produce very simple outputs whereas others might be more chaotic.\n\nPiece by @ciphrd for fxhash",
    tags: [
      "fxhash",
      "logo",
      "first",
      "mycelium",
      "walkers",
      "dividing"
    ],
    artifactUri: "ipfs://QmV17ZnUHxwjHRjVT3mHMPs4oNfFtA2bAHxq3C4HNkvZtM",
    displayUri: "ipfs://QmW6WBRx5M69kPx6CbSjsS4fcTVy21117pwwsU8iAMhBqX",
    thumbnailUri: "ipfs://QmWiqH6gw8vZT4VZ58gLCSNRxumJTVfJpe6q6mCZGzRNCo",
    generativeUri: "ipfs://Qmc4tMDF2ff8efhi7ybAZTWucQXbuUk9z7DozAUfFgWDZB",
    authenticityHash: "4e1f469734487086a67ee25ba1d5e4edd0346c449533505055b74f62f7fd66fe",
    symbol: "FXGEN",
    decimals: 0
  } as GenerativeTokenMetadata,
  price: 100.5,
  originalSupply: 600,
  supply: 256,
  balance: 0,
  enabled: true,
  author: {
    id: "tz1fepn7jZsCYBqCDhpM63hzh9g2Ytqk4Tpv",
    name: "fxhash",
    avatarUri: "ipfs://QmURUAU4YPa6Wwco3JSVrcN7WfCrFBZH7hY51BLrc87WjM"
  } as User,
}

/**
 * A function to turn call settings into a fake Generative Token, for the
 * purpose of display
 */
export function generativeFromMintParams(
  params: TInputMintIssuer<number, TInputPricingDetails<number>>,
  metadata: GenerativeTokenMetadata,
  metadataUri: string,
  author: User,
): GenerativeToken {
  return {
    id: 0,
    author: author,
    name: metadata.name,
    flag: GenTokFlag.NONE,
    metadata: metadata,
    metadataUri: metadataUri,
    tags: metadata.tags,
    pricingFixed: params.pricing.pricing_id === 0 ? ({
      price: params.pricing.details.price,
      opensAt: params.pricing.details.opensAt 
        ? new Date(params.pricing.details.opensAt) 
        : undefined as any
    }): undefined,
    // todo
    pricingDutchAuction: undefined,
    // todo: remove
    price: 0,
    originalSupply: params.amount,
    supply: params.amount,
    balance: params.amount,
    enabled: params.enabled,
    royalties: params.royalties,
    splitsPrimary: params.primary_split,
    splitsSecondary: params.royalties_split,
    // todo
    reserves: params.reserves as any,
    lockedSeconds: 0,
    lockEnd: new Date(0),
    objkts: [],
    actions: [],
    createdAt: new Date(),
  }
}