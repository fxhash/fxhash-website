import { gql } from "@apollo/client"
import Head from "next/head"
import { GetServerSideProps, NextPage } from "next"
import { createApolloClient } from "../../../services/ApolloClient"
import { GenerativeTokenWithCollection } from "../../../types/entities/GenerativeToken"
import ClientOnly from "../../../components/Utils/ClientOnly"
import { GenerativeEnjoy } from "../../../containers/Generative/Enjoy/GenerativeEnjoy"
import { useMemo } from "react"
import { shuffleArray } from "../../../utils/array"
import { getGenerativeTokenUrl } from "../../../utils/generative-token"
import { Frag_UserBadge } from "../../../queries/fragments/user"
import { getImageApiUrl, OG_IMAGE_SIZE } from "../../../components/Image"

interface Props {
  token: GenerativeTokenWithCollection
}

const GenerativeTokenEnjoy: NextPage<Props> = ({ token }) => {
  // get the display url for og:image
  const displayUrl =
    token.captureMedia?.cid &&
    getImageApiUrl(token.captureMedia.cid, OG_IMAGE_SIZE)

  // inject the author within the issuer of the token
  for (const gentk of token.entireCollection) {
    // @ts-ignore - little hack to reduce API load
    gentk.issuer = {
      id: token.id,
      name: token.name,
      author: token.author,
      generativeUri: token.generativeUri,
    }
  }

  // randomize the order of the collection
  const rndCollection = useMemo(
    () => shuffleArray(token.entireCollection),
    [token]
  )

  return (
    <>
      <Head>
        <title>fxhash — collection of {token.name}</title>
        <meta
          key="og:title"
          property="og:title"
          content={`${token.name} — enjoy`}
        />
        <meta
          key="description"
          name="description"
          content={`Sit back and enjoy the collection ${token.name}, created by ${token.author.name}`}
        />
        <meta
          key="og:description"
          property="og:description"
          content={`Sit back and enjoy the collection ${token.name}, created by ${token.author.name}`}
        />
        <meta key="og:type" property="og:type" content="website" />
        <meta
          key="og:image"
          property="og:image"
          content={displayUrl || "https://www.fxhash.xyz/images/og/og1.jpg"}
        />
        <meta name="twitter:site" content="@fx_hash_" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${token.name} — enjoy`} />
        <meta
          name="twitter:description"
          content={`Sit back and enjoy the collection ${token.name}, created by ${token.author.name}`}
        />
        <meta
          name="twitter:image"
          content={displayUrl || "https://www.fxhash.xyz/images/og/og1.jpg"}
        />
      </Head>

      <ClientOnly>
        <GenerativeEnjoy
          tokens={rndCollection}
          backLink={`${getGenerativeTokenUrl(token)}/collection`}
        />
      </ClientOnly>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const idStr = context.params?.id
  let token = null

  if (idStr) {
    const id = parseInt(idStr as string)
    if (id === 0 || id) {
      const apolloClient = createApolloClient()
      const { data, error } = await apolloClient.query({
        query: gql`
          ${Frag_UserBadge}
          query Query($id: Float!) {
            generativeToken(id: $id) {
              id
              name
              metadata
              generativeUri
              author {
                ...UserBadgeInfos
              }
              entireCollection {
                id
                name
                metadata
                iteration
                generationHash
                owner {
                  ...UserBadgeInfos
                }
              }
            }
          }
        `,
        fetchPolicy: "no-cache",
        variables: { id },
      })
      if (data) {
        token = data.generativeToken
      }
    }
  }

  return {
    props: {
      token: token,
    },
    notFound: !token,
  }
}

export default GenerativeTokenEnjoy
