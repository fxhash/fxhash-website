import { GetServerSideProps } from "next"
import Head from "next/head"
import { Spacing } from "../../../../../components/Layout/Spacing"
import layout from "../../../../../styles/Layout.module.scss"
import text from "../../../../../styles/Text.module.css"
import color from "../../../../../styles/Colors.module.css"
import cs from "classnames"
import { createApolloClient } from "../../../../../services/ApolloClient"
import { GenerativeToken } from "../../../../../types/entities/GenerativeToken"
import { Qu_genToken } from "../../../../../queries/generative-token"
import { Article } from "../../../../../components/Article/Article"
import { EntityBadge } from "../../../../../components/User/EntityBadge"
import { Reveal } from "../../../../../containers/Reveal/Reveal"
import { LayoutMinimalist } from "../../../../../components/Layout/LayoutMinimalist"
import { NextPageWithLayout } from "../../../../../containers/App"
import { LiveMintingLayout } from "../../../../../containers/LiveMinting/LiveMintingLayout"
import Link from "next/link"
import { useContext } from "react"
import { LiveMintingContext } from "../../../../../context/LiveMinting"
import { Button } from "../../../../../components/Button"
import { Submit } from "../../../../../components/Form/Submit"
import { UserContext } from "../../../../../containers/UserProvider"
import { getUserProfileLink } from "../../../../../utils/user"
import { User } from "../../../../../types/entities/User"

interface Props {
  hash: string
  token: GenerativeToken
}

const LiveMintingRevealPage: NextPageWithLayout<Props> = ({ hash, token }) => {
  const eventCtx = useContext(LiveMintingContext)
  const { user } = useContext(UserContext)

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
          </div>
          <Spacing size="3x-large" />
          <Reveal hash={hash} generativeUri={token.metadata.generativeUri} />

          <Submit layout="center">
            <Link
              href={`/live-minting/${eventCtx.event!.id}?token=${
                eventCtx.mintPass?.token
              }`}
              passHref
            >
              <Button
                isLink
                color="secondary"
                iconComp={<i aria-hidden className="fas fa-arrow-left" />}
                iconSide="left"
                size="regular"
                style={{ justifySelf: "center" }}
              >
                mint other project
              </Button>
            </Link>
          </Submit>

          <Submit layout="center">
            <Link
              href={`${getUserProfileLink(user as User)}/collection`}
              passHref
            >
              <Button
                isLink
                color="transparent"
                iconComp={<i aria-hidden className="fas fa-arrow-right" />}
                iconSide="right"
                size="regular"
                style={{ justifySelf: "center" }}
              >
                open your profile
              </Button>
            </Link>
          </Submit>
          <Spacing size="6x-large" />
        </main>
      </section>
    </>
  )
}
LiveMintingRevealPage.getLayout = LiveMintingLayout

export const getServerSideProps: GetServerSideProps = async (context) => {
  const hash = context.params?.hash
  const id =
    context.params?.number && parseInt(context.params?.number as string)
  let token = null

  if (hash != null && id != null) {
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
      hash,
      token: token,
    },
    notFound: !token || !hash,
  }
}

export default LiveMintingRevealPage
