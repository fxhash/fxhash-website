import { HistoryMetadata } from '../Metadata'
import { GenerativeToken } from './GenerativeToken'
import { Objkt } from './Objkt'
import { User } from './User'
import { NFTArticleInfos } from './Article'


export enum TokenActionType {
  NONE                          = "NONE",
  UPDATE_STATE                  = "UPDATE_STATE",
  UPDATE_PRICING                = "UPDATE_PRICING",
  BURN_SUPPLY                   = "BURN_SUPPLY",
  MINTED                        = "MINTED",
  MINTED_FROM                   = "MINTED_FROM",
  GENTK_SIGNED                  = "GENTK_SIGNED",
  COMPLETED                     = "COMPLETED",
  TRANSFERED                    = "TRANSFERED",
  LISTING_V1                    = "LISTING_V1",
  LISTING_V1_CANCELLED          = "LISTING_V1_CANCELLED",
  LISTING_V1_ACCEPTED           = "LISTING_V1_ACCEPTED",
  LISTING_V2                    = "LISTING_V2",
  LISTING_V2_CANCELLED          = "LISTING_V2_CANCELLED",
  LISTING_V2_ACCEPTED           = "LISTING_V2_ACCEPTED",
  OFFER                         = "OFFER",
  OFFER_CANCELLED               = "OFFER_CANCELLED",
  OFFER_ACCEPTED                = "OFFER_ACCEPTED",
  COLLECTION_OFFER              = "COLLECTION_OFFER",
  COLLECTION_OFFER_CANCELLED    = "COLLECTION_OFFER_CANCELLED",
  COLLECTION_OFFER_ACCEPTED     = "COLLECTION_OFFER_ACCEPTED",
  AUCTION                       = "AUCTION",
  AUCTION_BID                   = "AUCTION_BID",
  AUCTION_CANCELLED             = "AUCTION_CANCELLED",  
  AUCTION_FULFILLED             = "AUCTION_FULFILLED",
  ARTICLE_MINTED                = "ARTICLE_MINTED",
  ARTICLE_METADATA_UPDATED      = "ARTICLE_METADATA_UPDATED",
  ARTICLE_METADATA_LOCKED       = "ARTICLE_METADATA_LOCKED",
  ARTICLE_EDITIONS_TRANSFERED   = "ARTICLE_EDITIONS_TRANSFERED", 
}

export interface Action {
  id: string
  opHash: string
  type: TokenActionType
  numericValue: number
  issuer?: User
  target?: User
  token?: GenerativeToken
  objkt?: Objkt
  article?: NFTArticleInfos
  metadata: HistoryMetadata
  createdAt: string
}
