import type { NextPage } from "next"
import Head from "next/head"
import { createApolloClient } from "../services/ApolloClient"
import { gql } from "@apollo/client"
import {
  GenerativeToken,
  GenerativeTokenFilters,
  GenTokFlag,
} from "../types/entities/GenerativeToken"
import { Listing } from "../types/entities/Listing"
import React from "react"
import {
  Frag_GenAuthor,
  Frag_GenTokenInfo,
} from "../queries/fragments/generative-token"
import { Frag_MediaImage } from "../queries/fragments/media"
import { Frag_UserBadge } from "../queries/fragments/user"
import { Homepage } from "../containers/Homepage/Homepage"
import { NFTArticle } from "../types/entities/Article"

interface Props {
  randomGenerativeToken: GenerativeToken | null
  generativeTokens: GenerativeToken[]
  articles: NFTArticle[]
  listings: Listing[]
}

const Home: NextPage<Props> = ({
  randomGenerativeToken,
  generativeTokens,
  articles,
  //  listings,
}) => {
  return (
    <>
      <Head>
        <title>fxhash — home</title>
        <meta
          key="og:title"
          property="og:title"
          content="fxhash — Generative Art on the Blockchain"
        />
        <meta
          key="description"
          name="description"
          content="fxhash is an open platform to mint and collect Generative Tokens on the Tezos blockchain"
        />
        <meta
          key="og:description"
          property="og:description"
          content="fxhash is a platform to mint and collect Generative Tokens on the Tezos blockchain"
        />
        <meta key="og:type" property="og:type" content="website" />
        <meta
          key="og:image"
          property="og:image"
          content="https://www.fxhash.xyz/images/og/og1.jpg"
        />
      </Head>
      <Homepage
        articles={articles}
        randomGenerativeToken={randomGenerativeToken}
        generativeTokens={generativeTokens}
      />
    </>
  )
}

export async function getServerSideProps() {
  interface IQueryVariables {
    skip: number
    take: number
    filters: GenerativeTokenFilters
  }
  const apolloClient = createApolloClient()
  const { data, error } = await apolloClient.query<any, IQueryVariables>({
    query: gql`
      ${Frag_GenAuthor}
      ${Frag_MediaImage}
      ${Frag_GenTokenInfo}
      ${Frag_UserBadge}
      query Query($skip: Int, $take: Int, $filters: GenerativeTokenFilter) {
        randomGenerativeToken {
          id
          name
          ...Author
          supply
          objkts(take: 10) {
            id
            iteration
            slug
            metadata
            captureMedia {
              ...MediaImage
            }
            owner {
              ...UserBadgeInfos
            }
          }
        }
        generativeTokens(skip: $skip, take: $take, filters: $filters) {
          ...TokenInfo
        }
        listings(skip: $skip, take: $take) {
          id
          price
          objkt {
            id
            name
            slug
            metadata
            captureMedia {
              ...MediaImage
            }
            issuer {
              labels
              ...Author
            }
            owner {
              ...UserBadgeInfos
            }
            activeListing {
              id
              price
            }
          }
        }
        articles(take: 2, sort: { createdAt: "DESC" }) {
          id
          title
          slug
          author {
            ...UserBadgeInfos
          }
        }
      }
    `,
    fetchPolicy: "no-cache",
    variables: {
      skip: 0,
      take: 10,
      filters: {
        mintOpened_eq: true,
        flag_in: [GenTokFlag.CLEAN, GenTokFlag.NONE],
      },
    },
  })

  return {
    props: {
      randomGenerativeToken: data.randomGenerativeToken,
      generativeTokens: data.generativeTokens,
      listings: data.listings,
      articles: data.articles,
    },
  }
}

export default Home
