import type { NextPage } from "next"
import layout from "../../styles/Layout.module.scss"
import cs from "classnames"
import { Spacing } from "../../components/Layout/Spacing"
import { SectionHeader } from "../../components/Layout/SectionHeader"
import ClientOnly from "../../components/Utils/ClientOnly"
import Head from "next/head"
import { ExploreTabs } from "../../containers/Explore/ExploreTabs"
import { ExploreIncomingTokens } from "../../containers/Generative/ExploreIncoming"
import { SectionTitle } from "../../components/Layout/SectionTitle"

const Explore: NextPage = () => {
  return (
    <>
      <Head>
        <title>fxhash — incoming projects</title>
        <meta key="og:title" property="og:title" content="fxhash — explore" />
        <meta
          key="description"
          name="description"
          content="Get a glimpse at the soon available projects"
        />
        <meta
          key="og:description"
          property="og:description"
          content="Get a glimpse at the soon available projects"
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
          <SectionTitle>incoming projects</SectionTitle>
        </SectionHeader>

        <Spacing size="3x-large" sm="2x-large" />

        <ExploreTabs active={1} />

        <Spacing size="x-large" sm="regular" />

        <main className={cs(layout["padding-big"])}>
          <p>These tokens cannot be minted yet</p>
          <ClientOnly>
            <ExploreIncomingTokens />
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
