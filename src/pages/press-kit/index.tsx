import cs from "classnames"
import layout from "../../styles/Layout.module.scss"
import { NextPage } from "next"
import { SectionHeader } from "../../components/Layout/SectionHeader"
import { TitleHyphen } from "../../components/Layout/TitleHyphen"
import { Spacing } from "../../components/Layout/Spacing"
import Head from "next/head"
import { ClientOnlyEmpty } from "../../components/Utils/ClientOnly"
import { ContractsOpened } from "../../components/Utils/ContractsOpened"
import Planning from "../../containers/Planning"
import PressKitPage, { pressKitTabs } from "containers/Presskit/Page"

const PressKitIndexPage: NextPage = ({ tab }) => {
  return (
    <>
      <Head>
        <title>fxhash — opening schedule</title>
        <meta
          key="og:title"
          property="og:title"
          content="fxhash — opening schedule"
        />
        <meta
          key="description"
          name="description"
          content="The opening schedule of fxhash"
        />
        <meta
          key="og:description"
          property="og:description"
          content="The opening schedule of fxhash"
        />
        <meta key="og:type" property="og:type" content="website" />
        <meta
          key="og:image"
          property="og:image"
          content="https://www.fxhash.xyz/images/og/og1.jpg"
        />
      </Head>
      <PressKitPage tab={tab} />
    </>
  )
}

export const getServerSideProps: GetServerSideProps<SearchProps> = async () => {
  return {
    props: {
      tab: "fxhash",
    },
  }
}

export default PressKitIndexPage
