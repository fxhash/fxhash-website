import { gql } from "@apollo/client"
import { Frag_UserBadge } from "./fragments/user"
import { Frag_GenCardInfos } from "./fragments/generative-token"
import { Frag_ArticleInfos } from "./fragments/article"
import { Frag_ListingCardInfos } from "./fragments/listing"

export const Qu_search = gql`
  query Search(
    $usersFilters: UserFilter
    $usersSort: UserSortInput
    $usersTake: Int
    $usersSkip: Int
    $generativeTokensFilters: GenerativeTokenFilter
    $generativeTokensSort: GenerativeSortInput
    $generativeTokensTake: Int
    $generativeTokensSkip: Int
    $articlesFilters: ArticleFilter
    $articlesSort: ArticleSortInput
    $articlesTake: Int
    $articlesSkip: Int
    $listingsFilters: ListingFilter
    $listingsSort: ListingsSortInput
    $listingsTake: Int
    $listingsSkip: Int
  ) {
    users(
      filters: $usersFilters
      sort: $usersSort
      take: $usersTake
      skip: $usersSkip
    ) {
      id
      ...UserBadgeInfos
    }
    generativeTokens(
      filters: $generativeTokensFilters
      sort: $generativeTokensSort
      take: $generativeTokensTake
      skip: $generativeTokensSkip
    ) {
      id
      ...GenTokenCardInfos
    }
    articles(
      filters: $articlesFilters
      sort: $articlesSort
      take: $articlesTake
      skip: $articlesSkip
    ) {
      id
      ...ArticleInfos
    }
    listings(
      filters: $listingsFilters
      sort: $listingsSort
      take: $listingsTake
      skip: $listingsSkip
    ) {
      id
      ...ListingCardInfos
    }
  }
  ${Frag_UserBadge}
  ${Frag_GenCardInfos}
  ${Frag_ArticleInfos}
  ${Frag_ListingCardInfos}
`
