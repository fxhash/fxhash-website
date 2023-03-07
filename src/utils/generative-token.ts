import { differenceInSeconds } from "date-fns"
import { TRenderReserveComponent } from "../components/GenerativeToken/Reserves/Reserve"
import { ReserveAccessList } from "../components/GenerativeToken/Reserves/ReserveAccessList"
import { ReserveMintPass } from "../components/GenerativeToken/Reserves/ReserveMintPass"
import { TInputReserve } from "../components/Input/Reserves/InputReserve"
import { InputReserveMintPass } from "../components/Input/Reserves/InputReserveMintPass"
import { InputReserveWhitelist } from "../components/Input/Reserves/InputReserveWhitelist"
import { ILiveMintingContext } from "../context/LiveMinting"
import { IReserveConsumption } from "../services/contract-operations/Mint"
import { TInputMintIssuer } from "../services/parameters-builder/mint-issuer/input"
import { TInputPricingDetails } from "../services/parameters-builder/pricing/input"
import {
  GenerativeToken,
  GenTokFlag,
  GenTokLabel,
  GenTokLabelDefinition,
  GenTokLabelGroup,
  GenTokPricing,
} from "../types/entities/GenerativeToken"
import { IPricingDutchAuction, IPricingFixed } from "../types/entities/Pricing"
import { EReserveMethod, IReserve } from "../types/entities/Reserve"
import { User } from "../types/entities/User"
import { CaptureSettings, GenerativeTokenMetadata } from "../types/Metadata"
import {
  CaptureMode,
  CaptureTriggerMode,
  MintGenerativeData,
} from "../types/Mint"
import { getIpfsSlash } from "./ipfs"
import { clamp } from "./math"
import { tagsFromString } from "./strings"
import {
  transformPricingDutchInputToNumbers,
  transformPricingFixedInputToNumbers,
} from "./transformers/pricing"
import { transformReserveInputToGeneric } from "./transformers/reserves"
import { isUserOrCollaborator } from "./user"
import { ISettingsContext } from "../context/Theme"

export function getGenerativeTokenUrl(generative: GenerativeToken): string {
  return generative.slug
    ? `/generative/slug/${generative.slug}`
    : `/generative/${generative.id}`
}

export function getGenerativeTokenMarketplaceUrl(
  generative: GenerativeToken
): string {
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
    description:
      'This Generative Token is the first GT minted on fxhash.\n\nIt also servers as the actual logo of the platform. It represents the generative processes driving fxhash tokens. Generative Tokens are fed with a unique hash to produce unique outputs based on the hash — they are functions with a hash as single input.\n\nThe growth that comes out of the text is driven by a "Dividing-Aggregating Walkers" (DAW) algorithm. The hash drives all the DAW settings, as well as a mutation factor which is responsible for changes in each Walker parameters as they divide.\n\nSome iterations will produce very simple outputs whereas others might be more chaotic.\n\nPiece by @ciphrd for fxhash',
    childrenDescription:
      'Unique iteration of the first Generative Token minted on fxhash.\n\nIt also servers as the actual logo of the platform. It represents the generative processes driving fxhash tokens. Generative Tokens are fed with a unique hash to produce unique outputs based on the hash — they are functions with a hash as single input.\n\nThe growth that comes out of the text is driven by a "Dividing-Aggregating Walkers" (DAW) algorithm. The hash drives all the DAW settings, as well as a mutation factor which is responsible for changes in each Walker parameters as they divide.\n\nSome iterations will produce very simple outputs whereas others might be more chaotic.\n\nPiece by @ciphrd for fxhash',
    tags: ["fxhash", "logo", "first", "mycelium", "walkers", "dividing"],
    artifactUri: "ipfs://QmV17ZnUHxwjHRjVT3mHMPs4oNfFtA2bAHxq3C4HNkvZtM",
    displayUri: "ipfs://QmW6WBRx5M69kPx6CbSjsS4fcTVy21117pwwsU8iAMhBqX",
    thumbnailUri: "ipfs://QmWiqH6gw8vZT4VZ58gLCSNRxumJTVfJpe6q6mCZGzRNCo",
    generativeUri: "ipfs://Qmc4tMDF2ff8efhi7ybAZTWucQXbuUk9z7DozAUfFgWDZB",
    authenticityHash:
      "4e1f469734487086a67ee25ba1d5e4edd0346c449533505055b74f62f7fd66fe",
    symbol: "FXGEN",
    decimals: 0,
  } as GenerativeTokenMetadata,
  price: 100.5,
  originalSupply: 600,
  supply: 256,
  balance: 0,
  enabled: true,
  author: {
    id: "tz1fepn7jZsCYBqCDhpM63hzh9g2Ytqk4Tpv",
    name: "fxhash",
    avatarUri: "ipfs://QmURUAU4YPa6Wwco3JSVrcN7WfCrFBZH7hY51BLrc87WjM",
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
  usersLoaded: User[]
): GenerativeToken {
  return {
    id: 0,
    author: author,
    name: metadata.name,
    flag: GenTokFlag.NONE,
    metadata: metadata,
    metadataUri: metadataUri,
    thumbnailUri: metadata.thumbnailUri,
    displayUri: metadata.displayUri,
    tags: metadata.tags,
    labels: metadata.tags as any,
    pricingFixed:
      params.pricing.pricing_id === 0
        ? {
            price: params.pricing.details.price,
            opensAt: params.pricing.details.opens_at as any,
          }
        : undefined,
    // todo
    pricingDutchAuction:
      params.pricing.pricing_id === 1
        ? {
            levels: (params.pricing.details as any).levels,
            opensAt: params.pricing.details.opens_at as any,
            decrementDuration: (params.pricing.details as any)
              .decrement_duration,
          }
        : undefined,
    // todo: remove
    price: 0,
    originalSupply: params.amount,
    supply: params.amount,
    balance: params.amount,
    enabled: params.enabled,
    royalties: params.royalties,
    splitsPrimary: params.primary_split.map((split) => ({
      pct: split.pct,
      user:
        usersLoaded.find((u) => u.id === split.address) ||
        ({
          id: split.address,
        } as User),
    })),
    splitsSecondary: params.royalties_split.map((split) => ({
      pct: split.pct,
      user:
        usersLoaded.find((u) => u.id === split.address) ||
        ({
          id: split.address,
        } as User),
    })),
    // todo
    reserves: params.reserves as any,
    lockedSeconds: 0,
    lockEnd: new Date(0).toISOString(),
    objkts: [],
    actions: [],
    createdAt: new Date().toISOString(),
  }
}

/**
 * Given some MintGenerativeData, built with the mint pipeline, outputs a JSON
 * object which corresponds to the metadata which needs to be uploaded to IPFS
 * and associated with the token on chain.
 */
export function generativeMetadataFromMintForm(
  data: MintGenerativeData
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
  } else if (data.captureSettings!.mode === CaptureMode.CANVAS) {
    capture.canvasSelector = data.captureSettings!.canvasSelector
  }
  // set settings based on the trigger mode
  if (data.captureSettings!.triggerMode === CaptureTriggerMode.DELAY) {
    capture.delay = data.captureSettings!.delay
  } else if (
    data.captureSettings!.triggerMode === CaptureTriggerMode.FN_TRIGGER
  ) {
    // we don't need to add anything
  }

  let artifactUri = `${getIpfsSlash(data.cidUrlParams!)}?fxhash=${
    data.previewHash
  }`

  if (data.previewInputBytes) {
    artifactUri += `&fxparams=${data.previewInputBytes}`
  }

  return {
    name: data.informations!.name,
    description: data.informations!.description,
    childrenDescription:
      data.informations!.childrenDescription || data.informations!.description,
    tags: tagsFromString(data.informations!.tags),
    artifactUri,
    displayUri: getIpfsSlash(data.cidPreview!),
    thumbnailUri: getIpfsSlash(data.cidThumbnail!),
    generativeUri: getIpfsSlash(data.cidUrlParams!),
    authenticityHash: data.authHash2!,
    previewHash: data.previewHash!,
    previewInputBytes: data.previewInputBytes!,
    capture,
    settings: data.settings ?? null,
    symbol: "FXGEN",
    decimals: 0,
    version: "0.3",
    params: data.params!,
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
  user: User
): GenerativeToken {
  const dist = data.distribution!
  const pricing = dist.pricing

  // we need to * 60 the decrement duration from the form
  const pricingDA =
    pricing.pricingMethod === GenTokPricing.DUTCH_AUCTION
      ? transformPricingDutchInputToNumbers(
          pricing.pricingDutchAuction as IPricingDutchAuction<string>
        )
      : undefined
  if (pricingDA) {
    pricingDA.decrementDuration *= 60
  }

  return {
    id: 0,
    author: data.collaboration ?? user,
    name: data.informations!.name,
    flag: GenTokFlag.NONE,
    metadata: metadata,
    metadataUri: "ipfs://not-uploaded-to-ipfs-yet",
    thumbnailUri: metadata.thumbnailUri,
    displayUri: metadata.displayUri,
    tags: metadata.tags,
    labels: data.informations?.labels,
    pricingFixed:
      pricing.pricingMethod === GenTokPricing.FIXED
        ? transformPricingFixedInputToNumbers(
            pricing.pricingFixed as IPricingFixed<string>
          )
        : undefined,
    pricingDutchAuction: pricingDA,
    // todo: remove
    price: 0,
    originalSupply: parseInt(dist.editions!),
    supply: parseInt(dist.editions!),
    balance: parseInt(dist.editions!),
    enabled: dist.enabled,
    royalties: Math.floor(parseFloat(dist.royalties!) * 10),
    splitsPrimary: dist.splitsPrimary.map((split) => ({
      pct: split.pct,
      user:
        split.address === user.id
          ? user
          : (data.collaboration &&
              data.collaboration.collaborators.find(
                (user) => user.id === split.address
              )) ||
            ({
              id: split.address,
            } as User),
    })),
    splitsSecondary: dist.splitsSecondary.map((split) => ({
      pct: split.pct,
      user:
        split.address === user.id
          ? user
          : (data.collaboration &&
              data.collaboration.collaborators.find(
                (user) => user.id === split.address
              )) ||
            ({
              id: split.address,
            } as User),
    })),
    reserves: data.distribution?.reserves
      ? transformReserveInputToGeneric(data.distribution?.reserves)
      : [],
    lockedSeconds: 0,
    lockEnd: new Date(0).toISOString(),
    objkts: [],
    actions: [],
    createdAt: new Date().toISOString(),
  }
}

/**
 * Maps the labels integers to their definition
 */
export const genTokLabelDefinitions: Record<
  GenTokLabel,
  GenTokLabelDefinition
> = {
  0: {
    label: "Epileptic trigger",
    shortLabel: "Epileptic trigger",
    group: GenTokLabelGroup.WARNING,
    description:
      "Contains flashes or light that could trigger seizures for people with visual sensitivities",
    icon: "fa-solid fa-bolt",
    showWarningSetting: "epilepsy",
    showWarningOn: "run",
  },
  1: {
    label: "Sexual content",
    shortLabel: "Sexual content",
    group: GenTokLabelGroup.WARNING,
    description: "Nudity",
    icon: "fa-solid fa-eye-slash",
    showWarningSetting: "nsfw",
    showWarningOn: "preview",
  },
  2: {
    label: "Sensitive content (blood, gore,...)",
    shortLabel: "Sensitive content",
    group: GenTokLabelGroup.WARNING,
    description: "Violence and Sensitive content",
    icon: "fa-solid fa-eye-slash",
    showWarningSetting: "nsfw",
    showWarningOn: "preview",
  },
  100: {
    label: "Image composition",
    shortLabel: "Image composition",
    group: GenTokLabelGroup.DETAILS,
  },
  101: {
    label: "Animated",
    shortLabel: "Animated",
    group: GenTokLabelGroup.DETAILS,
  },
  102: {
    label: "Interactive",
    shortLabel: "Interactive",
    group: GenTokLabelGroup.DETAILS,
  },
  103: {
    label: "Profile Picture (PFP)",
    shortLabel: "PFP",
    group: GenTokLabelGroup.DETAILS,
  },
  104: {
    label: "Audio",
    shortLabel: "Audio",
    group: GenTokLabelGroup.DETAILS,
  },
  105: {
    label: "Includes prerendered components",
    shortLabel: "Prerendered components",
    group: GenTokLabelGroup.DETAILS,
  },
}

export const getGenTokLabelDefinition = (
  label: number
): GenTokLabelDefinition =>
  //@ts-ignore
  genTokLabelDefinitions[label]

export const getGenTokLabelDefinitions = (labels: number[]) =>
  labels.map((label) => getGenTokLabelDefinition(label)).filter((res) => !!res)

export interface GenTokWarning {
  icons: string[]
  labels: string[]
  descriptions: string[]
}
export const getGenTokWarning = (
  labels: GenTokLabel[],
  settings: ISettingsContext,
  on?: GenTokLabelDefinition["showWarningOn"]
): GenTokWarning | null => {
  const warning = labels.reduce(
    (acc, label) => {
      const def = getGenTokLabelDefinition(label)
      if (!def) return acc
      const showWarning =
        def.showWarningSetting !== undefined &&
        !!settings[def.showWarningSetting]
      const filterByOn = on ? on === def.showWarningOn : true
      if (def.group === GenTokLabelGroup.WARNING && showWarning && filterByOn) {
        if (def.icon && !acc.icons.includes(def.icon)) {
          acc.icons.push(def.icon)
        }
        acc.labels.push(def.shortLabel)
        if (def.description) {
          acc.descriptions.push(def.description)
        }
      }
      return acc
    },
    { icons: [], labels: [], descriptions: [] } as GenTokWarning
  )
  return warning.labels.length > 0 ? warning : null
}

export const mapGenTokPricingToId: Record<GenTokPricing, number> = {
  FIXED: 0,
  DUTCH_AUCTION: 1,
}

/**
 * Maps a Pricing enum to its corresponding ID
 */
export function genTokPricingToId(pricingEnum: GenTokPricing) {
  return mapGenTokPricingToId[pricingEnum]
}

/**
 * Outputs the current price of a Generative Token based on its pricing
 * settings and based on the current time
 */
export function genTokCurrentPrice(token: GenerativeToken) {
  let price = 0
  if (token.pricingFixed) {
    price = token.pricingFixed.price
  } else if (token.pricingDutchAuction) {
    const da = token.pricingDutchAuction
    // if there's a final price for the auction, we set it
    if (da.finalPrice) {
      price = da.finalPrice
    }
    // otherwise we compute price based on timer
    else {
      const diff = differenceInSeconds(new Date(), new Date(da.opensAt!))
      const idx = clamp(
        Math.floor(diff / da.decrementDuration),
        0,
        da.levels.length - 1
      )
      price = da.levels[idx]
    }
  }
  return price
}

/**
 * Is the user the author of a Generative Token ?
 * Looks for author as a member of authoring collaboration if any.
 */
export function isGenerativeAuthor(
  token: GenerativeToken,
  user: User
): boolean {
  return isUserOrCollaborator(user, token.author)
}

//
// RESERVE STUFF
//

interface IReserveDefinition {
  id: number
  label: string
  description: string
  inputComponent: TInputReserve
  renderComponent: TRenderReserveComponent
  initialValue: any
}

// maps reserves to their definition
export const mapReserveDefinition: Record<EReserveMethod, IReserveDefinition> =
  {
    WHITELIST: {
      id: 0,
      label: "Access List",
      description: "A list of users to whom a number of editions is reserved",
      inputComponent: InputReserveWhitelist,
      renderComponent: ReserveAccessList,
      initialValue: [],
    },
    MINT_PASS: {
      id: 1,
      label: "Mint Pass",
      description:
        "[For Live Events] A Smart Contract which controls whether a user can mint or not.",
      inputComponent: InputReserveMintPass,
      renderComponent: ReserveMintPass,
      initialValue: "",
    },
  }

// maps the reserve IDs to their enum
export const mapReserveIdtoEnum: Record<number, EReserveMethod> =
  Object.fromEntries(
    Object.keys(mapReserveDefinition).map((K) => [
      mapReserveDefinition[K as EReserveMethod].id,
      K,
    ]) as any
  )

/**
 * How many editions are left in the reserve ?
 */
export function reserveSize(token: GenerativeToken): number {
  let size = 0
  for (const reserve of token.reserves) {
    size += reserve.amount
  }
  return Math.min(token.balance, size)
}

type TReserveEligibility = (
  reserve: IReserve,
  user: User,
  liveMintContext?: ILiveMintingContext
) => number

/**
 * Maps a reserve method with its function to compute how many can be consumed
 * from the reserve
 */
const mapReserveToEligiblity: Record<EReserveMethod, TReserveEligibility> = {
  WHITELIST: (reserve, user) => {
    return reserve.data[user.id] || 0
  },
  MINT_PASS: (reserve, user, passCtx) => {
    return reserve.data
      ? passCtx?.mintPass?.group?.address === reserve.data
        ? 1
        : 0
      : 0
  },
}

/**
 * Is a user elligible to mint from the reserve of a token ?
 */
export function reserveEligibleAmount(
  user: User,
  token: GenerativeToken,
  liveMintingContext?: ILiveMintingContext
): number {
  let eligibleFor = 0
  if (token.reserves && user && user.id) {
    for (const reserve of token.reserves) {
      if (reserve.amount > 0 && reserve.method) {
        eligibleFor += Math.min(
          mapReserveToEligiblity[reserve.method](
            reserve,
            user,
            liveMintingContext
          ),
          reserve.amount
        )
      }
    }
  }
  return eligibleFor
}

/**
 * Returns the size of the reserves
 */
export function getReservesAmount(reserves: IReserve[]): number {
  return reserves && reserves.length > 0
    ? reserves.reduce((a, b) => a + b.amount, 0)
    : 0
}

/**
 * Get the best reserve consumption method to consume, or null if no reserve
 * can be consumed
 */
export function getReserveConsumptionMethod(
  token: GenerativeToken,
  user: User,
  liveMintingContext: ILiveMintingContext
): IReserveConsumption | null {
  let consumption: IReserveConsumption | null = null

  // only if a token has a reserve we check
  if (token.reserves) {
    // we sort the reserve, MINT_PASS is last
    const sorted = token.reserves.sort((a, b) =>
      a.method === EReserveMethod.MINT_PASS ? -1 : 1
    )

    // we parse the reserve and check for a match
    for (const reserve of token.reserves) {
      if (reserve.amount > 0) {
        if (
          mapReserveToEligiblity[reserve.method](
            reserve,
            user,
            liveMintingContext
          ) > 0
        ) {
          consumption = {
            method: reserve.method,
            data: {
              token: liveMintingContext.mintPass?.token,
              address: user.id,
              project: token.id,
              reserveData: reserve.data,
            },
          }
          break
        }
      }
    }
  }

  return consumption
}
