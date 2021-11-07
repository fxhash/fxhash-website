import { GetServerSideProps, NextPage } from "next"
import Head from "next/head"
import { Spacing } from "../../components/Layout/Spacing"
import layout from "../../styles/Layout.module.scss"
import cs from "classnames"
import client from "../../services/ApolloClient"
import { gql } from "@apollo/client"
import { Objkt } from "../../types/entities/Objkt"
import { useState } from "react"
import { Reveal } from "../../containers/Reveal/Reveal"
import { RevealProgress } from "../../containers/Reveal/RevealProgress"
import { TokenFeature } from "../../types/Metadata"


interface Props {
  hash: string
  token: Objkt|null
}

const RevealPage: NextPage<Props> = ({ hash, token }) => {
  // these are the URIs to the content to be revealed to the user
  const [generativeUri, setGenerativeUri] = useState<string|null>(token && (token.assigned ? token.metadata!.artifactUri : null))
  const [previewUri, setPreviewUri] = useState<string|null>(token && (token.assigned ? token.metadata!.displayUri : null))
  const [features, setFeatures] = useState<TokenFeature[]|null|undefined>(token && (token.assigned ? token.features : null))

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
        <main className={cs(layout['padding-big'])}>
          {generativeUri && previewUri ? (
            <Reveal
              generativeUri={generativeUri}
              previeweUri={previewUri}
              features={features}
            />
          ):(
            <RevealProgress 
              hash={hash}
              onRevealed={(genUri, prevUri, features) => {
                setGenerativeUri(genUri)
                setPreviewUri(prevUri)
                setFeatures(features)
              }}
            />
          )}
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
  let token = null

  if (hash) {
    const { data, error } = await client.query({
      query: gql`
        query Query($hash: String!) {
          objkt(hash: $hash) {
            id
            royalties
            assigned
            generationHash
            iteration
            features
            owner {
              id
              name
              avatarUri
            }
            name
            issuer {
              id
              name
              metadata
              author {
                id
                name
                avatarUri
              }
            }
            metadata
          }
        }
      `,
      fetchPolicy: "no-cache",
      variables: { hash }
    })
    if (data) {
      token = data.objkt
    }
  }

  return {
    props: {
      hash,
      token: token,
    }
  }
}

export default RevealPage