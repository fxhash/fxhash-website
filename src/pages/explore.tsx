import type { NextPage } from 'next'
import layout from '../styles/Layout.module.scss'
import cs from 'classnames'
import { Spacing } from '../components/Layout/Spacing'
import { SectionHeader } from '../components/Layout/SectionHeader'
import ClientOnly from '../components/Utils/ClientOnly'
import { ExploreGenerativeTokens } from '../containers/ExploreGenerativeTokens'
import Head from 'next/head'
import { TitleHyphen } from '../components/Layout/TitleHyphen'
import { ExploreTabs } from '../containers/Explore/ExploreTabs'
import { SectionTitle } from '../components/Layout/SectionTitle'

const Explore: NextPage = () => {
  return (
    <>
      <Head>
        <title>fxhash — explore</title>
        <meta key="og:title" property="og:title" content="fxhash — explore"/> 
        <meta key="description" name="description" content="Explore the work made by artists on fxhash"/>
        <meta key="og:description" property="og:description" content="Explore the work made by artists on fxhash"/>
        <meta key="og:type" property="og:type" content="website"/>
        <meta key="og:image" property="og:image" content="https://www.fxhash.xyz/images/og/og1.jpg"/>
      </Head>

      <Spacing size="3x-large" />

      <section>
        <SectionHeader layout="center">
          <SectionTitle>explore generators</SectionTitle>
        </SectionHeader>

        <Spacing size="3x-large" />

        <ExploreTabs active={0} />

        <main className={cs(layout['padding-big'])}>
          <ClientOnly>
            <ExploreGenerativeTokens />
          </ClientOnly>
        </main>
      </section>

      <Spacing size="6x-large" />
      <Spacing size="6x-large" />
      <Spacing size="6x-large" />
    </>
  )
}

export default Explore
