import Head from "next/head"
import { GetServerSideProps, NextPage } from "next"
import layout from "../../styles/Layout.module.scss"
import cs from "classnames"
import { createApolloClient } from "../../services/ApolloClient"
import { GenerativeToken } from "../../types/entities/GenerativeToken"
import { Spacing } from "../../components/Layout/Spacing"
import { truncateEnd } from "../../utils/strings"
import { Qu_genToken } from "../../queries/generative-token"
import { GenerativeFlagBanner } from "../../containers/Generative/FlagBanner"
import { GenerativeDisplay } from "../../containers/Generative/Display/GenerativeDisplay"
import { getImageApiUrl, OG_IMAGE_SIZE } from "../../components/Image"
import { GenerativeTokenTabs } from "../../containers/Generative/GenerativeTokenTabs"
import { createEventsClient } from "services/EventsClient"
import { Qu_redeemableDetails } from "queries/events/redeemable"
import { RedeemableDetails } from "types/entities/Redeemable"

interface Props {
  token: GenerativeToken
  redeemableDetails: RedeemableDetails[] | null
}

const GenerativeTokenDetails: NextPage<Props> = ({
  token,
  redeemableDetails,
}) => {
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

      <GenerativeFlagBanner token={token} />

      <Spacing size="3x-large" sm="x-large" />

      <section className={cs(layout["padding-big"])}>
        <GenerativeDisplay
          token={token}
          redeemableDetails={redeemableDetails}
        />
      </section>

      <Spacing size="6x-large" />
      <Spacing size="6x-large" sm="none" />

      <GenerativeTokenTabs token={token} />

      <Spacing size="6x-large" />
      <Spacing size="6x-large" />
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  let idStr, slug

  if (context.params?.params && context.params.params[0]) {
    if (context.params.params[0] === "slug" && context.params.params[1]) {
      slug = context.params.params[1]
    } else if (context.params.params[0]) {
      idStr = context.params.params[0]
    }
  }
  let token,
    redeemableDetails = null
  const apolloClient = createApolloClient()
  if (idStr) {
    const id = parseInt(idStr as string)
    if (id === 0 || id) {
      const { data } = await apolloClient.query({
        query: Qu_genToken,
        fetchPolicy: "no-cache",
        variables: { id },
      })
      if (data) {
        token = data.generativeToken
      }
    }
  } else if (slug) {
    const { data } = await apolloClient.query({
      query: Qu_genToken,
      fetchPolicy: "no-cache",
      variables: { slug },
    })
    if (data) {
      token = data.generativeToken
    }
  }

  if (token && token.redeemables?.length) {
    // query the events API to get details about the redeemables
    const { data } = await createEventsClient().query({
      query: Qu_redeemableDetails,
      fetchPolicy: "no-cache",
      variables: {
        where: {
          address: {
            in: token.redeemables.map((red: any) => red.address),
          },
        },
      },
    })
    redeemableDetails = data.consumables
  }

  return {
    props: {
      token,
      redeemableDetails,
    },
    notFound: !token,
  }
}

export default GenerativeTokenDetails
