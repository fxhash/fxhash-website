import { GetServerSideProps, NextPage } from "next"
import Head from "next/head"
import { Spacing } from "../../../components/Layout/Spacing"
import layout from "../../../styles/Layout.module.scss"
import text from "../../../styles/Text.module.css"
import color from "../../../styles/Colors.module.css"
import cs from "classnames"
import client from "../../../services/ApolloClient"
import { Reveal } from "../../../containers/Reveal/Reveal"
import { GenerativeToken } from "../../../types/entities/GenerativeToken"
import { Qu_genToken } from "../../../queries/generative-token"
import { Article } from "../../../components/Article/Article"
import { UserBadge } from "../../../components/User/UserBadge"
import Link from "next/link"
import { Button } from "../../../components/Button"


interface Props {
  hash: string
  token: GenerativeToken
}

const RevealPage: NextPage<Props> = ({ hash, token }) => {
  return (
    <>
      <Head>
        <title>fxhash — reveal token</title>
        <meta key="og:title" property="og:title" content="fxhash — reveal gentk"/> 
        <meta key="description" name="description" content="Reveal a gentk minted from fxhash"/>
        <meta key="og:description" property="og:description" content="Reveal a gentk minted from fxhash"/>
        <meta key="og:type" property="og:type" content="website"/>
        <meta key="og:image" property="og:image" content="https://www.fxhash.xyz/images/og/og1.jpg"/>
      </Head>

      <section>
        <Spacing size="3x-large"/>
        <main className={cs(layout['padding-big'])}>
          <Reveal
            hash={hash}
            generativeUri={token.metadata.generativeUri}
          />

          <Spacing size="3x-large"/>

          <div className={cs(layout.y_centered)}>
            <span className={cs(text.small, color.gray)}>this is your unique iteration of</span>
            <h2>{ token.name }</h2>
            <div className={cs(layout.x_centered)}>
              <span style={{ marginRight: 10 }}>created by </span>
              <UserBadge user={token.author} />
            </div>
          </div>

          <Spacing size="3x-large"/>

          <Article>
            <p>
              Your token will now have to go through a <strong>signing process</strong>. No more actions are required from yourself, this happens automatically in the back stage ! Until this process is finished, your token will appear as <strong>[waiting to be signed]</strong> in your wallet and on fxhash.
            </p>
            <p>
              During the signing, fxhash servers will generate the token metadata and send it to the blockchain. This process is required for a few reasons:
            </p>
            <ul>
              <li>an image preview of the token needs to be generated for it to be displayed on any platform properly</li>
              <li>features need to be extracted from the program</li>
            </ul>
            <p>
              The signing of the metadata can only happen once, and once done your token become immutable on the blockchain.
            </p>
          </Article>

          <Spacing size="6x-large"/>

          <div className={cs(layout.y_centered)}>
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
          </div>
        </main>
      </section>

      <Spacing size="6x-large" />
      <Spacing size="6x-large" />
      <Spacing size="6x-large" />
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const hash = context.params?.hash
  const id = context.params?.id && parseInt(context.params?.id as string)
  let token = null

  if (hash != null && id != null) {
    const { data, error } = await client.query({
      query: Qu_genToken,
      fetchPolicy: "no-cache",
      variables: {
        id
      }
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
    notFound: !token || !hash
  }
}

export default RevealPage