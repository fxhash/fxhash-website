import { gql } from "@apollo/client";

export const Frag_ListingArticle = gql`
  fragment ListingArticle on Listing {
    id
    amount
    version
    price
    createdAt
    issuer {
      id
      name
      avatarUri
      flag
    }
  }
`;
