import {
  Action as ActionType,
  TokenActionType,
} from "../../types/entities/Action"
import { getArticleUrl } from "../../utils/entities/articles"
import { ActionDefinition, TActionLinkFn } from "./Actions/Action"
import { ActionMinted } from "./Actions/ActionMinted"
import { ActionMintedFrom } from "./Actions/ActionMintedFrom"
import { ActionSigned } from "./Actions/ActionSigned"
import { ActionCompleted } from "./Actions/ActionMintCompleted"
import { ActionTransfered } from "./Actions/ActionTransfered"
import { ActionTODO } from "./Actions/ActionTODO"
import { ActionListing } from "./Actions/ActionListing"
import { ActionListingAccepted } from "./Actions/ActionListingAccepted"
import { ActionListingCancelled } from "./Actions/ActionListingCancelled"
import { ActionUpdatePrice } from "./Actions/ActionUpdatePrice"
import { ActionUpdateState } from "./Actions/ActionUpdateState"
import { ActionBurnSupply } from "./Actions/ActionBurnSupply"
import { ActionOffer } from "./Actions/ActionOffer"
import { ActionOfferAccepted } from "./Actions/ActionOfferAccepted"
import { ActionArticleMinted } from "./Actions/ActionArticleMinted"
import { ActionArticleEditionsTransfered } from "./Actions/ActionArticleTransfered"
import { ActionArticleUpdated } from "./Actions/ActionArticleUpdated"
import { ActionArticleLocked } from "./Actions/ActionArticleLocked"
import { ActionListingV3 } from "./Actions/ActionListingV3"
import { ActionListingAcceptedV3 } from "./Actions/ActionListingAcceptedV3"
import { ActionListingCancelledV3 } from "./Actions/ActionListingCancelledV3"
import { getObjktUrl } from "../../utils/objkt"

const ActionLinks = {
  gentk: (action: ActionType) => `/gentk/${action.objkt?.id}`,
  token: (action: ActionType) => `/generative/${action.token?.id}`,
  article: (action: ActionType) => getArticleUrl(action.article!),
  gentkOrArticle: (action: ActionType) =>
    action.article ? getArticleUrl(action.article) : getObjktUrl(action.objkt!),
} as const

const ActionTodoDefinition: ActionDefinition = {
  icon: "",
  iconColor: "error",
  render: ActionTODO,
  predecescence: 0,
  link: null,
}

export const ActionDefinitions: Record<TokenActionType, ActionDefinition> = {
  MINTED: {
    icon: "fa-solid fa-user-robot",
    iconColor: "success",
    render: ActionMinted,
    predecescence: 0,
    link: ActionLinks.token,
  },
  MINTED_FROM: {
    icon: "fa-solid fa-sparkles",
    iconColor: "success",
    render: ActionMintedFrom,
    predecescence: 0,
    link: ActionLinks.gentk,
  },
  GENTK_SIGNED: {
    icon: "fa-solid fa-signature",
    iconColor: "success",
    render: ActionSigned,
    predecescence: 0,
    link: null,
  },
  COMPLETED: {
    icon: "fas fa-check-circle",
    iconColor: "success",
    render: ActionCompleted,
    predecescence: 0,
    link: ActionLinks.token,
  },
  TRANSFERED: {
    icon: "fa-regular fa-arrow-right-arrow-left",
    iconColor: "success",
    render: ActionTransfered,
    predecescence: 0,
    link: ActionLinks.gentk,
  },
  LISTING_V1: {
    icon: "fa-regular fa-arrow-turn-up",
    iconColor: "success",
    render: ActionListing,
    predecescence: 0,
    link: ActionLinks.gentk,
  },
  LISTING_V1_ACCEPTED: {
    icon: "fa-regular fa-arrow-right-arrow-left",
    iconColor: "success",
    render: ActionListingAccepted,
    predecescence: 0,
    link: ActionLinks.gentk,
  },
  LISTING_V1_CANCELLED: {
    icon: "fa-solid fa-xmark",
    iconColor: "error",
    render: ActionListingCancelled,
    predecescence: 0,
    link: ActionLinks.gentk,
  },
  LISTING_V2: {
    icon: "fa-regular fa-arrow-turn-up",
    iconColor: "success",
    render: ActionListing,
    predecescence: 0,
    link: ActionLinks.gentk,
  },
  LISTING_V2_ACCEPTED: {
    icon: "fa-regular fa-arrow-right-arrow-left",
    iconColor: "success",
    render: ActionListingAccepted,
    predecescence: 0,
    link: ActionLinks.gentk,
  },
  LISTING_V2_CANCELLED: {
    icon: "fa-solid fa-xmark",
    iconColor: "error",
    render: ActionListingCancelled,
    predecescence: 0,
    link: ActionLinks.gentk,
  },
  LISTING_V3: {
    icon: "fa-regular fa-arrow-turn-up",
    iconColor: "success",
    render: ActionListingV3,
    predecescence: 0,
    link: ActionLinks.gentkOrArticle,
  },
  LISTING_V3_ACCEPTED: {
    icon: "fa-regular fa-arrow-right-arrow-left",
    iconColor: "success",
    render: ActionListingAcceptedV3,
    predecescence: 0,
    link: ActionLinks.gentkOrArticle,
  },
  LISTING_V3_CANCELLED: {
    icon: "fa-solid fa-xmark",
    iconColor: "error",
    render: ActionListingCancelledV3,
    predecescence: 0,
    link: ActionLinks.gentkOrArticle,
  },
  UPDATE_PRICING: {
    icon: "fa-solid fa-arrow-rotate-right",
    iconColor: "warning",
    render: ActionUpdatePrice,
    predecescence: 0,
    link: ActionLinks.token,
  },
  UPDATE_STATE: {
    icon: "fa-solid fa-arrow-rotate-right",
    iconColor: "warning",
    render: ActionUpdateState,
    predecescence: 0,
    link: ActionLinks.token,
  },
  BURN_SUPPLY: {
    icon: "fa-solid fa-fire",
    iconColor: "warning",
    render: ActionBurnSupply,
    predecescence: 0,
    link: ActionLinks.token,
  },
  OFFER: {
    icon: "fa-regular fa-arrow-turn-up",
    iconColor: "success",
    render: ActionOffer,
    predecescence: 0,
    link: ActionLinks.gentk,
  },
  OFFER_ACCEPTED: {
    icon: "fa-regular fa-arrow-right-arrow-left",
    iconColor: "success",
    render: ActionOfferAccepted,
    predecescence: 0,
    link: ActionLinks.gentk,
  },
  OFFER_CANCELLED: {
    icon: "fa-solid fa-xmark",
    iconColor: "error",
    render: ActionListingCancelled,
    predecescence: 0,
    link: ActionLinks.gentk,
  },
  ARTICLE_MINTED: {
    icon: "fa-sharp fa-solid fa-memo",
    iconColor: "success",
    render: ActionArticleMinted,
    predecescence: 0,
    link: ActionLinks.article,
  },
  ARTICLE_EDITIONS_TRANSFERED: {
    icon: "fa-regular fa-arrow-right-arrow-left",
    iconColor: "success",
    render: ActionArticleEditionsTransfered,
    predecescence: 0,
    link: ActionLinks.article,
  },
  ARTICLE_METADATA_UPDATED: {
    icon: "fa-sharp fa-solid fa-pen-to-square",
    iconColor: "warning",
    render: ActionArticleUpdated,
    predecescence: 0,
    link: ActionLinks.article,
  },
  ARTICLE_METADATA_LOCKED: {
    icon: "fa-solid fa-lock",
    iconColor: "warning",
    render: ActionArticleLocked,
    predecescence: 0,
    link: ActionLinks.article,
  },

  // TODO
  NONE: ActionTodoDefinition,
  COLLECTION_OFFER: ActionTodoDefinition,
  COLLECTION_OFFER_CANCELLED: ActionTodoDefinition,
  COLLECTION_OFFER_ACCEPTED: ActionTodoDefinition,
  AUCTION: ActionTodoDefinition,
  AUCTION_BID: ActionTodoDefinition,
  AUCTION_CANCELLED: ActionTodoDefinition,
  AUCTION_FULFILLED: ActionTodoDefinition,
}
