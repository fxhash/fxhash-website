import { TInputMintIssuer } from "../services/parameters-builder/mint-issuer/input"
import { TInputPricingDetails } from "../services/parameters-builder/pricing/input"
import { GenerativeToken, GenTokFlag, GenTokLabel, GenTokPricing } from "../types/entities/GenerativeToken"
import { IPricingDutchAuction, IPricingFixed } from "../types/entities/Pricing"
import { User } from "../types/entities/User"
import { CaptureSettings, GenerativeTokenMetadata } from "../types/Metadata"
import { CaptureMode, CaptureTriggerMode, MintGenerativeData } from "../types/Mint"
import { getIpfsSlash } from "./ipfs"
import { tagsFromString } from "./strings"
import { transformPricingDutchInputToNumbers, transformPricingFixedInputToNumbers } from "./transformers/pricing"

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
      opensAt: params.pricing.details.opens_at 
        ? new Date(params.pricing.details.opens_at) 
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

/**
 * Given some MintGenerativeData, built with the mint pipeline, outputs a JSON
 * object which corresponds to the metadata which needs to be uploaded to IPFS
 * and associated with the token on chain.
 */
export function generativeMetadataFromMintForm(
  data: MintGenerativeData,
): GenerativeTokenMetadata {
  // build the capture settings
  const capture: CaptureSettings = {
    mode: data.captureSettings!.mode!,
    triggerMode: data.captureSettings!.triggerMode!,
    gpu: data.captureSettings!.gpu,
  }
  // set settings based on the capture mode
  if (data.captureSettings!.mode === CaptureMode.VIEWPORT) {
    capture.resolution = {
      x: data.captureSettings!.resX!,
      y: data.captureSettings!.resY!,
    }
  }
  else if (data.captureSettings!.mode === CaptureMode.CANVAS) {
    capture.canvasSelector = data.captureSettings!.canvasSelector
  }
  // set settings based on the trigger mode
  if (data.captureSettings!.triggerMode === CaptureTriggerMode.DELAY) {
    capture.delay = data.captureSettings!.delay
  }
  else if (data.captureSettings!.triggerMode === CaptureTriggerMode.FN_TRIGGER) {
    // we don't need to add anything
  }

  return {
    name: data.informations!.name,
    description: data.informations!.description,
    childrenDescription: data.informations!.childrenDescription || data.informations!.description,
    tags: tagsFromString(data.informations!.tags),
    artifactUri: `${getIpfsSlash(data.cidUrlParams!)}?fxhash=${data.previewHash}`,
    displayUri: getIpfsSlash(data.cidPreview!),
    thumbnailUri: getIpfsSlash(data.cidThumbnail!),
    generativeUri: getIpfsSlash(data.cidUrlParams!),
    authenticityHash: data.authHash2!,
    previewHash: data.previewHash!,
    capture,
    settings: data.settings ?? null,
    symbol: "FXGEN",
    decimals: 0,
    version: "0.2"
  }
}

/**
 * Given some MintGenerativeData, built with the mint pipeline, outputs a
 * GenerativeToken object instance which can be used for previsualisation
 * purposes
 */
export function generativeFromMintForm(
  data: MintGenerativeData,
  metadata: GenerativeTokenMetadata,
  user: User,
): GenerativeToken {
  const dist = data.distribution!
  const pricing = dist.pricing

  return {
    id: 0,
    author: data.collaboration ?? user,
    name: data.informations!.name,
    flag: GenTokFlag.NONE,
    metadata: metadata,
    metadataUri: "ipfs://not-uploaded-to-ipfs-yet",
    tags: metadata.tags,
    pricingFixed: pricing.pricingMethod === GenTokPricing.FIXED 
      ? transformPricingFixedInputToNumbers(
        pricing.pricingFixed as IPricingFixed<string>
      )
      : undefined,
    pricingDutchAuction: pricing.pricingMethod === GenTokPricing.DUTCH_AUCTION 
      ? transformPricingDutchInputToNumbers(
        pricing.pricingDutchAuction as IPricingDutchAuction<string>
      )
      : undefined,
    // todo: remove
    price: 0,
    originalSupply: parseInt(dist.editions!),
    supply: parseInt(dist.editions!),
    balance: parseInt(dist.editions!),
    enabled: dist.enabled,
    royalties: Math.floor(parseFloat(dist.royalties!)*10),
    splitsPrimary: dist.splitsPrimary,
    splitsSecondary: dist.splitsSecondary,
    reserves: [],
    lockedSeconds: 0,
    lockEnd: new Date(0),
    objkts: [],
    actions: [],
    createdAt: new Date(),
  }
}


/**
 * Maps the label identifiers with their string names
 */
export const mapGenTokLabels: Record<GenTokLabel, string> = {
  0: "Epileptic trigger",
  1: "Sexual content",
  2: "Sensitive content (blood, gore,...)",
  100: "Image composition",
  101: "Animated",
}

export const mapGenTokPricingToId: Record<GenTokPricing, number> = {
  "FIXED": 0,
  "DUTCH_AUCTION": 1,
}

/**
 * Maps a Pricing enum to its corresponding ID
 */
export function genTokPricingToId(pricingEnum: GenTokPricing) {
  return mapGenTokPricingToId[pricingEnum]
}