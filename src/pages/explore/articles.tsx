import type { NextPage } from "next"
import Head from "next/head"
import { Spacing } from "../../components/Layout/Spacing"
import { SectionHeader } from "../../components/Layout/SectionHeader"
import { ExploreTabs } from "../../containers/Explore/ExploreTabs"
import { SectionTitle } from "../../components/Layout/SectionTitle"
import { ExploreArticles } from "../../containers/Explore/ExploreArticles"

const ExploreRevealFeed: NextPage = () => {
  return (
    <>
      <Head>
        <title>fxhash — articles</title>
        <meta key="og:title" property="og:title" content="fxhash — articles" />
        <meta
          key="description"
          name="description"
          content="Explore articles made by our artistes"
        />
        <meta
          key="og:description"
          property="og:description"
          content="Explore articles made by our artistes"
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
          <SectionTitle>explore articles</SectionTitle>
        </SectionHeader>

        <Spacing size="3x-large" sm="2x-large" />

        <ExploreTabs active={2} />

        <main>
          <ExploreArticles />
        </main>
      </section>

      <Spacing size="6x-large" sm="5x-large" />
      <Spacing size="6x-large" sm="none" />
      <Spacing size="6x-large" sm="none" />
    </>
  )
}

export default ExploreRevealFeed
