import Head from "next/head"
import { NextPage } from "next"
import { GenerativeToken } from "types/entities/GenerativeToken"
import { truncateEnd } from "utils/strings"
import { getImageApiUrl, OG_IMAGE_SIZE } from "components/Image"
import { MintWithTicketPage } from "containers/MintWithTicket/MintWithTicketPage"

interface Props {
  token: GenerativeToken
}

export const ExploreParams = ({ token }: Props) => {
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
