import Head from "next/head"
import { GetServerSideProps, NextPage } from "next"
import { createApolloClient } from "services/ApolloClient"
import { GenerativeToken } from "types/entities/GenerativeToken"
import { Spacing } from "components/Layout/Spacing"
import { truncateEnd } from "utils/strings"
import { Qu_genToken } from "queries/generative-token"
import { getImageApiUrl, OG_IMAGE_SIZE } from "components/Image"
import { MintWithTicketPage } from "containers/MintWithTicket/MintWithTicketPage"

interface Props {
  token: GenerativeToken
  ticketId: string
}

const MintWithTicket: NextPage<Props> = ({ token }) => {
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
      <MintWithTicketPage token={token} />
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { ticketId, slug } = context?.params || {}
  let token = null
  const apolloClient = createApolloClient()
  if (slug) {
    const { data } = await apolloClient.query({
      query: Qu_genToken,
      fetchPolicy: "no-cache",
      variables: { slug },
    })
    if (data) {
      token = data.generativeToken
    }
  }

  return {
    props: {
      token: token,
      ticketId,
    },
    notFound: !token || !ticketId,
  }
}

export default MintWithTicket
