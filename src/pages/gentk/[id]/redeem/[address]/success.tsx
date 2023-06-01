import { GetServerSideProps, NextPage } from "next"
import Head from "next/head"
import { Spacing } from "components/Layout/Spacing"
import layout from "styles/Layout.module.scss"
import text from "styles/Text.module.css"
import color from "styles/Colors.module.css"
import cs from "classnames"
import { createApolloClient } from "services/ApolloClient"
import { Article } from "components/Article/Article"
import Link from "next/link"
import { Button } from "components/Button"
import { EntityBadge } from "components/User/EntityBadge"
import { useRouter } from "next/router"
import { getGenerativeTokenUrl } from "utils/generative-token"
import { Qu_objkt } from "queries/objkt"
import { Objkt } from "types/entities/Objkt"
import { ArtworkPreview } from "components/Artwork/Preview"
import { createEventsClient } from "services/EventsClient"
import { Qu_redeemableDetails } from "queries/events/redeemable"
import { RedeemableDetails } from "types/entities/Redeemable"

interface Props {
  gentk: Objkt
  redeemableDetails: RedeemableDetails
}

const RevealPage: NextPage<Props> = ({ gentk, redeemableDetails }) => {
  const { query } = useRouter()
  const { available = "0" } = query

  return (
    <>
      <Head>
        <title>fxhash — redeem success</title>
        <meta
          key="og:title"
          property="og:title"
          content="fxhash — redeem success"
        />
        <meta
          key="description"
          name="description"
          content="Success confirmation for redeeming a gentk on fxhash"
        />
        <meta
          key="og:description"
          property="og:description"
          content="Success confirmation for redeeming a gentk on fxhash"
        />
        <meta key="og:type" property="og:type" content="website" />
        <meta
          key="og:image"
          property="og:image"
          content="https://www.fxhash.xyz/images/og/og1.jpg"
        />
      </Head>

      <section>
        <Spacing size="3x-large" />
        <main className={cs(layout["padding-big"])}>
          <div className={cs(layout.y_centered)}>
            <span className={cs(text.small, color.gray)}>
              you have successfully redeemed
            </span>
            <Spacing size="8px" />
            <h2>{gentk.name}</h2>
            <Spacing size="8px" />
            <div style={{ width: 400 }}>
              <ArtworkPreview
                image={gentk.captureMedia}
                ipfsUri={gentk.metadata?.thumbnailUri}
              />
            </div>
            <Spacing size="large" />
            <div className={cs(layout.x_centered)}>
              <span style={{ marginRight: 10 }}>created by </span>
              <EntityBadge
                size="regular"
                user={gentk.issuer.author}
                toggeable
              />
            </div>
            <Spacing size="large" />
            <span className={cs(text.success)}>
              {redeemableDetails.successInfos}
            </span>
            <Spacing size="large" />
            <Link href={getGenerativeTokenUrl(gentk.issuer)} passHref>
              <Button isLink={true} size="small">
                open project page
              </Button>
            </Link>
          </div>

          <Spacing size="large" />

          <Article className={cs(layout.small_centered)}>
            <p>
              Now that your token has been redeemed, there’s nothing left to do
              on your end. The token hasn’t changed and is still in your wallet
              {available === "0"
                ? ", but it can’t be redeemed again."
                : `- it can be redeemed ${available} more times.`}
            </p>
            <p>
              Please note that it is the artist&apos;s responsibility to fulfil
              your order - they will be in touch with you regarding status
              updates and delivery.
            </p>
          </Article>
        </main>
      </section>

      <Spacing size="6x-large" />
      <Spacing size="6x-large" />
      <Spacing size="6x-large" />
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id, address } = context.query

  let token = null
  let redeemableDetails = null

  if (id != null) {
    const apolloClient = createApolloClient()
    const { data, error } = await apolloClient.query({
      query: Qu_objkt,
      fetchPolicy: "no-cache",
      variables: {
        id,
      },
    })
    if (data) {
      token = data.objkt
    }

    // query the events API to get details about the redeemables
    const { data: data2 } = await createEventsClient().query({
      query: Qu_redeemableDetails,
      fetchPolicy: "no-cache",
      variables: {
        where: {
          address: {
            equals: address,
          },
        },
      },
    })
    if (!data2 || !data2.consumables || data2.consumables.length < 1) {
      throw new Error("Could not find the redeemable in our database")
    }
    redeemableDetails = data2.consumables[0]
  }

  return {
    props: {
      gentk: token,
      redeemableDetails,
    },
    notFound: !token,
  }
}

export default RevealPage
