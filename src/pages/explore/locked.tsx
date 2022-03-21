import type { NextPage } from 'next'
import layout from '../../styles/Layout.module.scss'
import cs from 'classnames'
import { Spacing } from '../../components/Layout/Spacing'
import { SectionHeader } from '../../components/Layout/SectionHeader'
import ClientOnly from '../../components/Utils/ClientOnly'
import Head from 'next/head'
import { ExploreTabs } from '../../containers/Explore/ExploreTabs'
import { ExploreLockedTokens } from '../../containers/Generative/ExploreLocked'
import { SectionTitle } from '../../components/Layout/SectionTitle'

const Explore: NextPage = () => {
  return (
    <>
      <Head>
        <title>fxhash — locked tokens</title>
        <meta key="og:title" property="og:title" content="fxhash — explore"/> 
        <meta key="description" name="description" content="Get a glimpse at the soon available tokens"/>
        <meta key="og:description" property="og:description" content="Get a glimpse at the soon available tokens"/>
        <meta key="og:type" property="og:type" content="website"/>
        <meta key="og:image" property="og:image" content="https://www.fxhash.xyz/images/og/og1.jpg"/>
      </Head>
      <Spacing size="3x-large" />

      <section>
        <SectionHeader layout="center">
          <SectionTitle>explore locked generators</SectionTitle>
        </SectionHeader>

        <Spacing size="3x-large" />

        <ExploreTabs active={1} />

        <Spacing size="x-large"/>

        <main className={cs(layout['padding-big'])}>
          <p>These tokens are currently locked and will soon will be mintable</p>
          <ClientOnly>
            <ExploreLockedTokens />
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