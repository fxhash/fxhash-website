import type { NextPage } from "next"
import { Spacing } from "components/Layout/Spacing"
import { SectionHeader } from "components/Layout/SectionHeader"
import ClientOnly from "components/Utils/ClientOnly"
import { ExploreGenerativeTokens } from "containers/ExploreGenerativeTokens"
import Head from "next/head"
import { ExploreTabs } from "containers/Explore/ExploreTabs"
import { TitleHyphen } from "../../components/Layout/TitleHyphen"

const Explore: NextPage = () => {
  return (
    <>
      <Head>
        <title>fxhash — explore</title>
        <meta key="og:title" property="og:title" content="fxhash — explore" />
        <meta
          key="description"
          name="description"
          content="Explore the work made by artists on fxhash"
        />
        <meta
          key="og:description"
          property="og:description"
          content="Explore the work made by artists on fxhash"
        />
        <meta key="og:type" property="og:type" content="website" />
        <meta
          key="og:image"
          property="og:image"
          content="https://www.fxhash.xyz/images/og/og1.jpg"
        />
      </Head>

      <Spacing size="2x-large" sm="x-large" />

      <SectionHeader layout="left" sm="left">
        <TitleHyphen>explore generators</TitleHyphen>
      </SectionHeader>
      <section>
        <Spacing size="x-large" sm="2x-large" />

        <ExploreTabs active={0} />

        <ClientOnly>
          <ExploreGenerativeTokens />
        </ClientOnly>
      </section>

      <Spacing size="6x-large" />
      <Spacing size="6x-large" />
      <Spacing size="6x-large" />
    </>
  )
}

export default Explore
