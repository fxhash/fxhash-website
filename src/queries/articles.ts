import { gql } from "@apollo/client";
import { Frag_ArticleInfos } from "./fragments/article";

export const Qu_articles = gql`
  query Articles($skip: Int, $take: Int) {
    articles(sort: { createdAt: "DESC" }, skip: $skip, take: $take) {
      ...ArticleInfos
    }
  }
  ${Frag_ArticleInfos}
`;
