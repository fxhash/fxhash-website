import type { NextPage } from 'next'
import layout from '../styles/Layout.module.scss'
import cs from 'classnames'
import { Spacing } from '../components/Layout/Spacing'
import { SectionHeader } from '../components/Layout/SectionHeader'
import ClientOnly from '../components/Utils/ClientOnly'
import { ExploreGenerativeTokens } from '../containers/ExploreGenerativeTokens'
import { Marketplace } from '../containers/Marketplace'
import Head from 'next/head'



const MarketplacePage: NextPage = () => {
  return (
    <>
      <Head>
        <title>fxhash — marketplace</title>
        <meta key="og:title" property="og:title" content="fxhash — marketplace"/> 
        <meta key="description" property="description" content="Collect and trade your NFTs generated on fxhash"/>
        <meta key="og:description" property="og:description" content="Collect and trade your NFTs generated on fxhash"/>
        <meta key="og:type" property="og:type" content="website"/>
        <meta key="og:image" property="og:image" content="/images/og/og1.jpg"/>
      </Head>

      <Spacing size="6x-large" />

      <section>
        <SectionHeader>
          <h2>— marketplace</h2>
        </SectionHeader>

        <Spacing size="x-large"/>

        <main className={cs(layout['padding-big'])}>
          <ClientOnly>
            <Marketplace />
          </ClientOnly>
        </main>
      </section>

      <Spacing size="6x-large" />
      <Spacing size="6x-large" />
      <Spacing size="6x-large" />
    </>
  )
}

export default MarketplacePage
