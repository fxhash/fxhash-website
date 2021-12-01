import type { NextPage } from 'next'
import Head from 'next/head'
import layout from '../../styles/Layout.module.scss'
import cs from 'classnames'
import { Spacing } from '../../components/Layout/Spacing'
import { SectionHeader } from '../../components/Layout/SectionHeader'
import ClientOnly from '../../components/Utils/ClientOnly'
import { TitleHyphen } from '../../components/Layout/TitleHyphen'
import { ExploreTabs } from '../../containers/Explore/ExploreTabs'
import { LiveFeed } from '../../containers/Explore/LiveFeed'



const ExploreRevealFeed: NextPage = () => {
  return (
    <>
      <Head>
        <title>fxhash — feed</title>
        <meta key="og:title" property="og:title" content="fxhash — feed"/> 
        <meta key="description" name="description" content="Live feed of fxhash activity"/>
        <meta key="og:description" property="og:description" content="Live feed of fxhash activity"/>
        <meta key="og:type" property="og:type" content="website"/>
        <meta key="og:image" property="og:image" content="https://www.fxhash.xyz/images/og/og1.jpg"/>
      </Head>
      <Spacing size="6x-large" />

      <section>
        <SectionHeader>
          <TitleHyphen>explore / reveal feed</TitleHyphen>
        </SectionHeader>

        <Spacing size="x-large" />

        <ExploreTabs active={1} />

        <Spacing size="x-large"/>

        <main className={cs(layout['padding-big'])}>
          <ClientOnly>
            <LiveFeed />
          </ClientOnly>
        </main>
      </section>

      <Spacing size="6x-large" />
      <Spacing size="6x-large" />
      <Spacing size="6x-large" />
    </>
  )
}

export default ExploreRevealFeed