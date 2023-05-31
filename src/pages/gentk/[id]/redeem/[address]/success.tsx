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

interface Props {
  gentk: Objkt
}

const RevealPage: NextPage<Props> = ({ gentk }) => {
  const { query } = useRouter()
  const { message } = query

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
            <div className={cs(layout.x_centered)}>
              <span style={{ marginRight: 10 }}>created by </span>
              <EntityBadge
                size="regular"
                user={gentk.issuer.author}
                toggeable
              />
            </div>
            <Spacing size="large" />
            <span className={cs(text.success)}>{message}</span>
            <Spacing size="large" />
            <Link href={getGenerativeTokenUrl(gentk.issuer)} passHref>
              <Button isLink={true} size="small">
                open project page
              </Button>
            </Link>
          </div>

          <Spacing size="3x-large" />

          <Article className={cs(layout.small_centered)}>
            <p>
              Your purchase will now be processed <strong>blah blah</strong>. No
              more actions are required on your end, this happens automatically
              in the backend! blah blah blah, blah!
            </p>
          </Article>

          <Spacing size="6x-large" />

          {/* <div className={cs(layout.y_centered)}>
            <Link href={`/reveal/progress/${hash}`} passHref>
              <Button
                isLink
                color="secondary"
                iconComp={<i aria-hidden className="fas fa-arrow-right"/>}
                iconSide="right"
              >
                signing progress
              </Button>
            </Link>
          </div> */}
        </main>
      </section>

      <Spacing size="6x-large" />
      <Spacing size="6x-large" />
      <Spacing size="6x-large" />
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.query

  let token = null

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
  }

  return {
    props: {
      gentk: token,
    },
    notFound: !token,
  }
}

export default RevealPage
