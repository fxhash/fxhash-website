import { GetServerSideProps, NextPage } from "next"
import Head from "next/head"
import { Spacing } from "components/Layout/Spacing"
import layout from "styles/Layout.module.scss"
import text from "styles/Text.module.css"
import color from "styles/Colors.module.css"
import cs from "classnames"
import { createApolloClient } from "services/ApolloClient"
import { Reveal } from "containers/Reveal/Reveal"
import { GenerativeToken } from "types/entities/GenerativeToken"
import { Qu_genToken } from "queries/generative-token"
import { Article } from "components/Article/Article"
import { UserBadge } from "components/User/UserBadge"
import Link from "next/link"
import { Button } from "components/Button"
import { EntityBadge } from "components/User/EntityBadge"
import { useRouter } from "next/router"
import { getGenerativeTokenUrl } from "utils/generative-token"

interface Props {
  token: GenerativeToken
}

const RevealPage: NextPage<Props> = ({ token }) => {
  const { query } = useRouter()
  const { fxhash, fxparams, fxminter } = query

  return (
    <>
      <Head>
        <title>fxhash — reveal token</title>
        <meta
          key="og:title"
          property="og:title"
          content="fxhash — reveal gentk"
        />
        <meta
          key="description"
          name="description"
          content="Reveal a gentk minted from fxhash"
        />
        <meta
          key="og:description"
          property="og:description"
          content="Reveal a gentk minted from fxhash"
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
          <Reveal
            hash={fxhash as string}
            params={fxparams as string}
            minter={fxminter as string}
            generativeUri={token.metadata.generativeUri}
          />

          <Spacing size="3x-large" />

          <div className={cs(layout.y_centered)}>
            <span className={cs(text.small, color.gray)}>
              this is your unique iteration of
            </span>
            <Spacing size="8px" />
            <h2>{token.name}</h2>
            <Spacing size="8px" />
            <div className={cs(layout.x_centered)}>
              <span style={{ marginRight: 10 }}>created by </span>
              <EntityBadge size="regular" user={token.author} toggeable />
            </div>
            <Spacing size="large" />
            <Link href={getGenerativeTokenUrl(token)} passHref>
              <Button isLink={true} size="small">
                open project page
              </Button>
            </Link>
          </div>

          <Spacing size="3x-large" />

          <Article className={cs(layout.small_centered)}>
            <p>
              Your token will now have to go through a{" "}
              <strong>signing process</strong>. No more actions are required on
              your end, this happens automatically in the back stage ! Until
              this process is finished, your token will appear as{" "}
              <strong>[waiting to be signed]</strong> in your wallet and on
              fxhash.
            </p>
            <p>
              During the signing, fxhash servers will generate the token
              metadata and send it to the blockchain. This process is required
              for a few reasons:
            </p>
            <ul>
              <li>
                an image preview of the token needs to be generated for it to be
                displayed on any platform properly
              </li>
              <li>features need to be extracted from the program</li>
            </ul>
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
  const id = context.params?.id && parseInt(context.params?.id as string)
  const query = context.query

  let token = null

  if (id != null) {
    const apolloClient = createApolloClient()
    const { data, error } = await apolloClient.query({
      query: Qu_genToken,
      fetchPolicy: "no-cache",
      variables: {
        id,
      },
    })
    if (data) {
      token = data.generativeToken
    }
  }

  return {
    props: {
      token: token,
    },
    notFound: !token || !query?.fxhash,
  }
}

export default RevealPage
