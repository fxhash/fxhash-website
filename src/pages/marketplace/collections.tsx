import type { NextPage } from "next"
import layout from "../../styles/Layout.module.scss"
import cs from "classnames"
import { Spacing } from "../../components/Layout/Spacing"
import { SectionHeader } from "../../components/Layout/SectionHeader"
import { ClientOnlyEmpty } from "../../components/Utils/ClientOnly"
import Head from "next/head"
import { TitleHyphen } from "../../components/Layout/TitleHyphen"
import { MarketplaceTabs } from "../../containers/Marketplace/Tabs"
import { MarketplaceCollections } from "../../containers/Marketplace/Collections"
import { SectionTitle } from "../../components/Layout/SectionTitle"

const MarketplaceCollectionPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>fxhash — marketplace collections</title>
        <meta
          key="og:title"
          property="og:title"
          content="fxhash — marketplace collections"
        />
        <meta
          key="description"
          name="description"
          content="Explore the collections in the marketplace"
        />
        <meta
          key="og:description"
          property="og:description"
          content="Explore the collections in the marketplace"
        />
        <meta key="og:type" property="og:type" content="website" />
        <meta
          key="og:image"
          property="og:image"
          content="https://www.fxhash.xyz/images/og/og1.jpg"
        />
      </Head>

      <Spacing size="3x-large" sm="x-large" />

      <section>
        <SectionHeader layout="center" sm="left">
          <SectionTitle>marketplace / collections</SectionTitle>
        </SectionHeader>

        <Spacing size="3x-large" sm="2x-large" />

        <MarketplaceTabs active={1} />
        <main>
          <ClientOnlyEmpty>
            <MarketplaceCollections />
          </ClientOnlyEmpty>
        </main>
      </section>

      <Spacing size="6x-large" />
      <Spacing size="6x-large" />
      <Spacing size="6x-large" />
    </>
  )
}

export default MarketplaceCollectionPage
