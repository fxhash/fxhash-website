import Head from "next/head"
import { GetServerSideProps } from "next"
import layout from "../../../../styles/Layout.module.scss"
import cs from "classnames"
import { GenerativeToken } from "../../../../types/entities/GenerativeToken"
import { ipfsGatewayUrl } from "../../../../services/Ipfs"
import { truncateEnd } from "../../../../utils/strings"
import { Qu_genToken } from "../../../../queries/generative-token"
import client from "../../../../services/ApolloClient"
import { LayoutMinimalist } from "../../../../components/Layout/LayoutMinimalist"
import { NextPageWithLayout } from "../../../_app"
import { GenerativeDisplayMinimalist } from "../../../../containers/Generative/Display/GenerativeDisplayMinimalist"
import { Spacing } from "../../../../components/Layout/Spacing"
import { useCallback, useContext } from "react"
import { LiveMintingLayout } from "../../../../containers/LiveMinting/LiveMintingLayout"
import { LiveMintingContext } from "../../../../context/LiveMinting"

interface Props {
  eventId: string
  token: GenerativeToken
}

const GenerativeTokenDetails: NextPageWithLayout<Props> = ({
  eventId,
  token,
}) => {
  const liveMinting = useContext(LiveMintingContext)

  const handleGenerationRevealUrl = useCallback(
    ({ tokenId, hash }) =>
      `/live-minting/${eventId}/reveal/${tokenId}/${hash}/?token=${liveMinting.mintPass?.token}`,
    [eventId]
  )

  // get the display url for og:image
  const displayUrl =
    token.metadata?.displayUri && ipfsGatewayUrl(token.metadata?.displayUri)

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

      <Spacing size="3x-large" />
      <section className={cs(layout["padding-big"])}>
        <GenerativeDisplayMinimalist
          token={token}
          generateRevealUrl={handleGenerationRevealUrl}
        />
      </section>
      <Spacing size="6x-large" />
    </>
  )
}

GenerativeTokenDetails.getLayout = LiveMintingLayout

export const getServerSideProps: GetServerSideProps = async (context) => {
  const id = context.params?.tokenId as string
  let token: any = null

  if (id) {
    const { data, error } = await client.query({
      query: Qu_genToken,
      fetchPolicy: "no-cache",
      variables: {
        id: parseInt(id),
      },
    })
    if (data?.generativeToken) {
      token = data.generativeToken
    }
  }

  return {
    props: {
      eventId: context.params?.id,
      token: token,
    },
    notFound: !token,
  }
}

export default GenerativeTokenDetails
