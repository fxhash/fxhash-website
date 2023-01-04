import type { NextPage } from "next"
import { Spacing } from "../../components/Layout/Spacing"
import { ClientOnlyEmpty } from "../../components/Utils/ClientOnly"
import { Marketplace } from "../../containers/Marketplace"
import Head from "next/head"
import { MarketplaceTabs } from "../../containers/Marketplace/Tabs"
import { SectionHeader } from "../../components/Layout/SectionHeader";
import { SectionTitle } from "../../components/Layout/SectionTitle";
import { MarketplaceSold } from "../../containers/Marketplace/MarketplaceSold";

const MarketplacePage: NextPage = ({ query }: any) => {
  return (
    <>
      <Head>
        <title>fxhash — marketplace sold listings</title>
        <meta
          key="og:title"
          property="og:title"
          content="fxhash — marketplace sold listings"
        />
        <meta
          key="description"
          name="description"
          content="Explore sold listings of the fxhash marketplace"
        />
        <meta
          key="og:description"
          property="og:description"
          content="Explore sold listings of the fxhash marketplace"
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
          <SectionTitle>marketplace / sold</SectionTitle>
        </SectionHeader>
        <Spacing size="3x-large" sm="2x-large" />
        <MarketplaceTabs activeKey="sold" />
        <main>
          <ClientOnlyEmpty>
            <MarketplaceSold urlQuery={query} />
          </ClientOnlyEmpty>
        </main>
      </section>

      <Spacing size="6x-large" />
      <Spacing size="6x-large" />
      <Spacing size="6x-large" />
    </>
  )
}

// get url parameters
MarketplacePage.getInitialProps = async ({ query }) => {
  return { query }
}

export default MarketplacePage
