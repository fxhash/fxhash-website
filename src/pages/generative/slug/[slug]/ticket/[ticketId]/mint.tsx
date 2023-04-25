import Head from "next/head"
import { GetServerSideProps, NextPage } from "next"
import { createApolloClient } from "services/ApolloClient"
import { GenerativeToken } from "types/entities/GenerativeToken"
import { truncateEnd } from "utils/strings"
import { getImageApiUrl, OG_IMAGE_SIZE } from "components/Image"
import { MintWithTicketPage } from "containers/MintWithTicket/MintWithTicketPage"
import { MintTicket } from "../../../../../../types/entities/MintTicket"
import { gql } from "@apollo/client"
import { Frag_GenTokenInfo } from "../../../../../../queries/fragments/generative-token"

interface Props {
  token: GenerativeToken
  ticket: MintTicket
}

const MintWithTicket: NextPage<Props> = ({ token, ticket }) => {
  // get the display url for og:image
  const displayUrl =
    token.captureMedia?.cid &&
    getImageApiUrl(token.captureMedia.cid, OG_IMAGE_SIZE)
  return (
    <>
      <Head>
        <title>fxhash — {token.name}</title>
        <meta
          key="og:title"
          property="og:title"
          content={`${token.name} — fxhash`}
        />
        <meta
          key="description"
          name="description"
          content={truncateEnd(token.metadata?.description || "", 200, "")}
        />
        <meta
          key="og:description"
          property="og:description"
          content={truncateEnd(token.metadata?.description || "", 200, "")}
        />
        <meta key="og:type" property="og:type" content="website" />
        <meta
          key="og:image"
          property="og:image"
          content={displayUrl || "https://www.fxhash.xyz/images/og/og1.jpg"}
        />
        <meta name="twitter:site" content="@fx_hash_" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${token.name} — fxhash`} />
        <meta
          name="twitter:description"
          content={truncateEnd(token.metadata?.description || "", 200, "")}
        />
        <meta
          name="twitter:image"
          content={displayUrl || "https://www.fxhash.xyz/images/og/og1.jpg"}
        />
      </Head>

      <MintWithTicketPage token={token} ticket={ticket} mode="with-ticket" />
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { ticketId, slug } = context?.params || {}
  const apolloClient = createApolloClient()
  if (slug && ticketId && !Array.isArray(ticketId)) {
    const { data } = await apolloClient.query({
      query: gql`
        ${Frag_GenTokenInfo}
        query GenerativeTokenParam($slug: String, $ticketId: Float!) {
          generativeToken(slug: $slug) {
            ...TokenInfo
            tags
            moderationReason
            mintOpensAt
            lockEnd
            metadata
            metadataUri
            version
          }
          mintTicket(id: $ticketId) {
            id
            price
            taxationPaidUntil
          }
        }
      `,
      fetchPolicy: "no-cache",
      variables: { slug, ticketId: parseInt(ticketId) },
    })
    if (data.generativeToken && data.mintTicket) {
      return {
        props: {
          token: data.generativeToken,
          ticket: data.mintTicket,
        },
      }
    }
  }
  return {
    notFound: true,
  }
}

export default MintWithTicket
