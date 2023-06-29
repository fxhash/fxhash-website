import type { NextPage } from "next"
import Head from "next/head"
import {
  createApolloClient,
  createApolloClientEvent,
} from "../services/ApolloClient"
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
import { Frag_EventCard } from "../queries/fragments/event"
import { LiveMintingEvent } from "../types/entities/LiveMinting"

interface Props {
  randomGenerativeToken: GenerativeToken | null
  generativeTokens: GenerativeToken[]
  incomingTokens: GenerativeToken[]
  articles: NFTArticle[]
  listings: Listing[]
  events: LiveMintingEvent[]
}

const Home: NextPage<Props> = ({
  randomGenerativeToken,
  generativeTokens,
  incomingTokens,
  articles,
  events,
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
        events={events}
        articles={articles}
        randomGenerativeToken={randomGenerativeToken}
        generativeTokens={generativeTokens}
        incomingTokens={incomingTokens}
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
  const now = new Date()
  const eventApolloClient = createApolloClientEvent()
  const { data: dataEvent } = await eventApolloClient.query<{
    events: LiveMintingEvent[]
  }>({
    query: gql`
      ${Frag_EventCard}
      query Events($endAfter: DateTime) {
        events(
          take: 4
          where: { endsAt: { gte: $endAfter }, status: { equals: PUBLISHED } }
          orderBy: { startsAt: asc }
        ) {
          id
          ...EventCard
        }
      }
    `,
    variables: {
      endAfter: now.toISOString(),
    },
  })

  const apolloClient = createApolloClient()
  const { data } = await apolloClient.query<any, IQueryVariables>({
    query: gql`
      ${Frag_GenAuthor}
      ${Frag_MediaImage}
      ${Frag_GenTokenInfo}
      ${Frag_UserBadge}
      query Query($skip: Int, $take: Int, $filters: GenerativeTokenFilter) {
        randomTopGenerativeToken {
          id
          name
          slug
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
        incomingTokens: generativeTokens(
          take: 4
          filters: { mintOpened_eq: false, flag_in: [CLEAN, NONE] }
          sort: { mintOpensAt: "ASC" }
        ) {
          id
          ...TokenInfo
          lockEnd
          mintOpensAt
        }
        articles(take: 3, sort: { createdAt: "DESC" }) {
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
      randomGenerativeToken: data.randomTopGenerativeToken,
      generativeTokens: data.generativeTokens,
      incomingTokens: data.incomingTokens,
      articles: data.articles,
      events: dataEvent.events || [],
    },
  }
}

export default Home
