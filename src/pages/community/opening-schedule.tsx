import cs from "classnames"
import layout from "../../styles/Layout.module.scss"
import { NextPage } from "next"
import { SectionHeader } from "../../components/Layout/SectionHeader"
import { TitleHyphen } from "../../components/Layout/TitleHyphen"
import { Spacing } from "../../components/Layout/Spacing"
import Head from "next/head"
import { ClientOnlyEmpty } from "../../components/Utils/ClientOnly"
import { ContractsOpened } from "../../components/Utils/ContractsOpened"
import Planning from "../../containers/Planning";

const SchedulePage: NextPage = () => {
  return (
    <>
      <Head>
        <title>fxhash — opening schedule</title>
        <meta key="og:title" property="og:title" content="fxhash — opening schedule"/>
        <meta key="description" name="description" content="The opening schedule of fxhash"/>
        <meta key="og:description" property="og:description" content="The opening schedule of fxhash"/>
        <meta key="og:type" property="og:type" content="website"/>
        <meta key="og:image" property="og:image" content="https://www.fxhash.xyz/images/og/og1.jpg"/>
      </Head>

      <Spacing size="6x-large" />

      <section>
        <SectionHeader>
          <TitleHyphen>opening schedule</TitleHyphen>
        </SectionHeader>

        <Spacing size="3x-large" />

        <main className={cs(layout['padding-big'])}>
          <p>The publication of new Generative Tokens follows a schedule. When the schedule is closed, new Generative Tokens cannot be published on the platform, but minting unique iterations and interacting with the marketplace will remain possible.</p>
          <p>The indicator on the top-right [🔴/🟢] reflects the current state of the opening for Generative Tokens.</p>

          <Spacing size="3x-large" />

          <ClientOnlyEmpty>
            <h4>Current state</h4>
            <Spacing size="small"/>
            <ContractsOpened/>
          </ClientOnlyEmpty>

          <Spacing size="3x-large" />

          <ClientOnlyEmpty>
            <Planning />
          </ClientOnlyEmpty>

          <Spacing size="6x-large" />
        </main>
      </section>
    </>
  )
}

export default SchedulePage
