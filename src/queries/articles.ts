import { gql } from "@apollo/client";
import { Frag_ArticleFull, Frag_ArticleInfos } from "./fragments/article";
import { Frag_ListingArticle } from "./fragments/listing";

export const Qu_articles = gql`
  query Articles($filters: ArticleFilter, $sort: ArticleSortInput, $skip: Int, $take: Int) {
    articles(filters: $filters, sort: $sort, skip: $skip, take: $take) {
      ...ArticleInfos
    }
  }
  ${Frag_ArticleInfos}
`;
export const Qu_articleBySlug = gql`
  query ArticleBySlug($slug: String!) {
    article(slug: $slug) {
      ...ArticleFull
    }
  }
  ${Frag_ArticleFull}
`;
export const Qu_articleById = gql`
  query ArticleById($id: Int!) {
    article(id: $id) {
      ...ArticleFull
    }
  }
  ${Frag_ArticleFull}
`;
export const Qu_articleActionsById = gql`
  query ArticleActionsById($id: Int!) {
    article(id: $id) {
      id
      ledger {
        amount
        owner {
          id
          name
          avatarUri
          flag
        }
      }
      activeListings {
        ...ListingArticle
      }
    }
  }
  ${Frag_ListingArticle}
`
