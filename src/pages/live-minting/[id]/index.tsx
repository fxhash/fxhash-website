import Head from 'next/head'
import { NextPageWithLayout } from "../../_app"
import { LiveMintingEvent } from "../../../containers/LiveMinting/LiveMintingEvent"
import { LiveMintingLayout } from '../../../containers/LiveMinting/LiveMintingLayout'

const LiveMinting: NextPageWithLayout = (page) => {
  // todo fetch event name and change title / meta
  return (
    <>
      <Head>
        <title>fxhash — Live Minting</title>
        <meta key="og:title" property="og:title" content="fxhash — Live Minting"/>
        <meta key="description" name="description" content="Get your mint at <event_name>"/>
        <meta key="og:description" property="og:description" content="Get your mint at <event_name>"/>
        <meta key="og:type" property="og:type" content="website"/>
        <meta key="og:image" property="og:image" content="https://www.fxhash.xyz/images/og/og1.jpg"/>
      </Head>
      <LiveMintingEvent eventId="abc" />
    </>
  )
}

LiveMinting.getLayout = LiveMintingLayout

export default LiveMinting
