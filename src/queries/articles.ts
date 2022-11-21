import { gql } from "@apollo/client"
import {
  Frag_ArticleFull,
  Frag_ArticleInfos,
  Frag_ArticleInfosAction,
} from "./fragments/article"
import { Frag_ListingArticle } from "./fragments/listing"
import { Frag_UserBadge } from "./fragments/user"

export const Qu_articles = gql`
  query Articles(
    $filters: ArticleFilter
    $sort: ArticleSortInput
    $skip: Int
    $take: Int
  ) {
    articles(filters: $filters, sort: $sort, skip: $skip, take: $take) {
      ...ArticleInfos
    }
  }
  ${Frag_ArticleInfos}
`
export const Qu_articleBySlug = gql`
  query ArticleBySlug($slug: String!) {
    article(slug: $slug) {
      ...ArticleFull
    }
  }
  ${Frag_ArticleFull}
`
export const Qu_articleById = gql`
  query ArticleById($id: Int!) {
    article(id: $id) {
      ...ArticleFull
    }
  }
  ${Frag_ArticleFull}
`
export const Qu_articleActionsById = gql`
  query ArticleActionsById($id: Int!) {
    article(id: $id) {
      id
      title
      ledger {
        amount
        owner {
          ...UserBadgeInfos
        }
      }
      activeListings {
        ...ListingArticle
      }
    }
  }
  ${Frag_ListingArticle}
  ${Frag_UserBadge}
`

export const Qu_articleListingsById = gql`
  query ArticleActionsById($id: Int!) {
    article(id: $id) {
      id
      activeListings {
        ...ListingArticle
      }
    }
  }
  ${Frag_ListingArticle}
`
export const Qu_articleActions = gql`
  query Query($id: Int!, $skip: Int, $take: Int, $filters: ActionFilter) {
    article(id: $id) {
      id
      actions(skip: $skip, take: $take, filters: $filters) {
        id
        type
        opHash
        numericValue
        metadata
        createdAt
        issuer {
          ...UserBadgeInfos
        }
        target {
          ...UserBadgeInfos
        }
        article {
          id
          ...ArticleInfosAction
        }
      }
    }
  }
  ${Frag_ArticleInfosAction}
  ${Frag_UserBadge}
`
