import Head from "next/head"
import { GetServerSideProps, NextPage } from "next"
import layout from "../../styles/Layout.module.scss"
import cs from "classnames"
import { createApolloClient } from "../../services/ApolloClient"
import { Spacing } from "../../components/Layout/Spacing"
import { Objkt } from "../../types/entities/Objkt"
import { truncateEnd } from "../../utils/strings"
import { Qu_objkt } from "../../queries/objkt"
import { GenerativeFlagBanner } from "../../containers/Generative/FlagBanner"
import { ObjktTabs } from "../../containers/Objkt/ObjktTabs"
import { GenerativeDisplayIteration } from "../../containers/Generative/Display/GenerativeDisplayIteration"
import { getImageApiUrl, OG_IMAGE_SIZE } from "../../components/Image"

interface Props {
  objkt: Objkt
}

const ObjktDetails: NextPage<Props> = ({ objkt }) => {
  // get the display url for og:image
  const displayUrl =
    objkt.captureMedia?.cid &&
    getImageApiUrl(objkt.captureMedia.cid, OG_IMAGE_SIZE)

  return (
    <>
      <Head>
        <title>fxhash — {objkt.name}</title>
        <meta
          key="og:title"
          property="og:title"
          content={`${objkt.name} — fxhash`}
        />
        <meta
          key="description"
          name="description"
          content={truncateEnd(objkt.metadata?.description || "", 200, "")}
        />
        <meta
          key="og:description"
          property="og:description"
          content={truncateEnd(objkt.metadata?.description || "", 200, "")}
        />
        <meta key="og:type" property="og:type" content="website" />
        <meta
          key="og:image"
          property="og:image"
          content={displayUrl || "https://www.fxhash.xyz/images/og/og1.jpg"}
        />
        <meta name="twitter:site" content="@fx_hash_" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${objkt.name} — fxhash`} />
        <meta
          name="twitter:description"
          content={truncateEnd(objkt.metadata?.description || "", 200, "")}
        />
        <meta
          name="twitter:image"
          content={displayUrl || "https://www.fxhash.xyz/images/og/og1.jpg"}
        />
      </Head>

      <GenerativeFlagBanner token={objkt.issuer} />

      <Spacing size="3x-large" sm="x-large" />

      <section className={cs(layout["padding-big"])}>
        <GenerativeDisplayIteration objkt={objkt} />
      </section>

      <Spacing size="6x-large" />
      <Spacing size="6x-large" sm="none" />

      <ObjktTabs objkt={objkt} />

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
  let variables: Record<string, any> = {},
    token = null

  if (idStr) {
    const id = parseInt(idStr as string)
    if (id === 0 || id) {
      variables.id = id
    }
  } else if (slug) {
    variables.slug = slug
  }

  // only run query if valid variables
  if (Object.keys(variables).length > 0) {
    const apolloClient = createApolloClient()
    const { data } = await apolloClient.query({
      query: Qu_objkt,
      fetchPolicy: "no-cache",
      variables,
    })
    if (data) {
      token = data.objkt
    }
  }

  return {
    props: {
      objkt: token,
    },
    notFound: !token,
  }
}

export default ObjktDetails
