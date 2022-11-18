import { useContext } from "react"
import type { NextPage } from "next"
import { Spacing } from "../components/Layout/Spacing"
import Head from "next/head"
import { Qu_indexerStatus } from "../queries/indexer-status"
import { createApolloClient } from "../services/ApolloClient"
import { getTezosNetworkIndexerStatus } from "../services/IndexerStatus"
import { SectionTitle } from "../components/Layout/SectionTitle"
import { SectionHeader } from "../components/Layout/SectionHeader"
import { SectionWrapper } from "../components/Layout/SectionWrapper"
import { IndexerStatusDetails } from "../components/Status/IndexerStatusDetails"
import { IndexerStatusContext } from "../context/IndexerStatus"
import layout from "../styles/Layout.module.scss"

interface Props {}

const StatusPage: NextPage<Props> = () => {
  const { indexerStatus, networkStatus } = useContext(IndexerStatusContext)
  return (
    <>
      <Head>
        <title>fxhash — status</title>
        <meta key="og:title" property="og:title" content="fxhash — status" />
        <meta
          key="description"
          name="description"
          content="Collect and trade your NFTs generated on fxhash"
        />
        <meta
          key="og:description"
          property="og:description"
          content="Collect and trade your NFTs generated on fxhash"
        />
        <meta key="og:type" property="og:type" content="website" />
        <meta
          key="og:image"
          property="og:image"
          content="https://www.fxhash.xyz/images/og/og1.jpg"
        />
      </Head>

      <Spacing size="3x-large" />
      <div className={layout["padding-small"]}>
        <SectionWrapper layout="fixed-width-centered">
          <SectionHeader layout="center">
            <SectionTitle>Services status</SectionTitle>
          </SectionHeader>
          <Spacing size="3x-large" />
          <IndexerStatusDetails
            indexerStatus={indexerStatus}
            networkStatus={networkStatus}
          />
        </SectionWrapper>
      </div>
      <Spacing size="6x-large" />
      <Spacing size="6x-large" />
      <Spacing size="6x-large" />
    </>
  )
}

export async function getServerSideProps() {
  const apolloClient = createApolloClient()
  const { data, error } = await apolloClient.query<any>({
    query: Qu_indexerStatus,
    fetchPolicy: "no-cache",
  })

  const networkStatus = await getTezosNetworkIndexerStatus()
  return {
    props: {
      indexerStatus: data.statusIndexing,
      networkStatus,
    },
  }
}

export default StatusPage
