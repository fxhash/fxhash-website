import Head from 'next/head'
import { GetServerSideProps, NextPage } from "next"
import layout from "../../styles/Layout.module.scss"
import style from "../../styles/GenerativeTokenDetails.module.scss"
import cs from "classnames"
import client from "../../services/ApolloClient"
import { GenerativeToken } from "../../types/entities/GenerativeToken"
import { Spacing } from '../../components/Layout/Spacing'
import { ipfsGatewayUrl } from '../../services/Ipfs'
import { truncateEnd } from '../../utils/strings'
import { useState } from 'react'
import { Qu_genToken } from '../../queries/generative-token'
import { GenerativeActions } from '../../containers/Generative/Actions'
import { GenerativeFlagBanner } from '../../containers/Generative/FlagBanner'
import { TabDefinition, Tabs } from '../../components/Layout/Tabs'
import { GenerativeIterations } from '../../containers/Generative/Iterations/GenerativeIterations'
import { GenerativeDisplay } from '../../containers/Generative/Display/GenerativeDisplay'


const tabs: TabDefinition[] = [
  {
    name: "iterations"
  },
  {
    name: "activity"
  },
]

interface Props {
  token: GenerativeToken
}

const GenerativeTokenDetails: NextPage<Props> = ({ token }) => {
  const [tabActive, setTabActive] = useState<number>(0)

  // get the display url for og:image
  const displayUrl = token.metadata?.displayUri && ipfsGatewayUrl(token.metadata?.displayUri)

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

      <GenerativeFlagBanner token={token}/>

      <Spacing size="3x-large" />

      <section className={cs(layout['padding-big'])}>
        <GenerativeDisplay
          token={token}
        />
      </section>

      <Spacing size="6x-large" />
      <Spacing size="6x-large" />
      
      <Tabs
        activeIdx={tabActive}
        tabDefinitions={tabs}
        tabsLayout="fixed-size"
        onClickTab={setTabActive}
      />

      {tabActive === 0 ? (
        <GenerativeIterations
          token={token}
        />
      ):(
        <main className={cs(layout['padding-big'])}>
          <Spacing size="x-large"/>
          <GenerativeActions
            token={token}
            className={style.activity}
          /> 
        </main>
      )}

      <Spacing size="6x-large" />
      <Spacing size="6x-large" />
    </>
  )
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
      token: token,
    },
    notFound: !token
  }
}

export default GenerativeTokenDetails