import Head from 'next/head'
import { GetServerSideProps } from "next"
import layout from "../../../../styles/Layout.module.scss"
import cs from "classnames"
import { GenerativeToken } from "../../../../types/entities/GenerativeToken"
import { ipfsGatewayUrl } from '../../../../services/Ipfs'
import { truncateEnd } from '../../../../utils/strings'
import { Qu_genToken } from '../../../../queries/generative-token'
import client from "../../../../services/ApolloClient";
import { LayoutMinimalist } from "../../../../components/Layout/LayoutMinimalist";
import { NextPageWithLayout } from "../../../_app";
import { GenerativeDisplayMinimalist } from "../../../../containers/Generative/Display/GenerativeDisplayMinimalist";
import { Spacing } from "../../../../components/Layout/Spacing";
import { useCallback } from "react";

interface Props {
  eventId: string
  token: GenerativeToken
}

const GenerativeTokenDetails: NextPageWithLayout<Props> = ({ eventId, token }) => {
  const handleGenerationRevealUrl = useCallback(({ tokenId, hash }) =>
    `/live-minting/${eventId}/reveal/${tokenId}/${hash}`, [eventId]);

  // get the display url for og:image
  const displayUrl = token.metadata?.displayUri
    && ipfsGatewayUrl(token.metadata?.displayUri)

  return (
    <>
      <Head>
        <title>fxhash — {token.name}</title>
        <meta key="og:title" property="og:title" content={`${token.name} — fxhash`}/>
        <meta key="description" name="description" content={truncateEnd(token.metadata?.description || "", 200, "")}/>
        <meta key="og:description" property="og:description" content={truncateEnd(token.metadata?.description || "", 200, "")}/>
        <meta key="og:type" property="og:type" content="website"/>
        <meta key="og:image" property="og:image" content={displayUrl || "https://www.fxhash.xyz/images/og/og1.jpg"}/>
        <meta name="twitter:site" content="@fx_hash_"/>
        <meta name="twitter:card" content="summary_large_image"/>
        <meta name="twitter:title" content={`${token.name} — fxhash`}/>
        <meta name="twitter:description" content={truncateEnd(token.metadata?.description || "", 200, "")}/>
        <meta name="twitter:image" content={displayUrl || "https://www.fxhash.xyz/images/og/og1.jpg"}/>
      </Head>
      <Spacing size="3x-large" />
      <section className={cs(layout['padding-big'])}>
        <GenerativeDisplayMinimalist
          token={token}
          generateRevealUrl={handleGenerationRevealUrl}
        />
      </section>
    </>
  )
}

GenerativeTokenDetails.getLayout = (page) => {
  return (<LayoutMinimalist requireWallet>{page}</LayoutMinimalist>)
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  let idStr,
      slug

  if (context.params?.params && context.params.params[0]) {
    if (context.params.params[0] === "slug" && context.params.params[1]) {
      slug = context.params.params[1]
    }
    else if (context.params.params[0]) {
      idStr = context.params.params[0]
    }
  }
  let token = null

  if (idStr) {
    const id = parseInt(idStr as string)
    if (id === 0 || id) {
      const { data } = await client.query({
        query: Qu_genToken,
        fetchPolicy: "no-cache",
        variables: { id }
      })
      if (data) {
        token = data.generativeToken
      }
    }
  }
  else if (slug) {
    const { data } = await client.query({
      query: Qu_genToken,
      fetchPolicy: "no-cache",
      variables: { slug }
    })
    if (data) {
      token = data.generativeToken
    }
  }

  return {
    props: {
      eventId: context.params?.id,
      token: token,
    },
    notFound: !token
  }
}

export default GenerativeTokenDetails
