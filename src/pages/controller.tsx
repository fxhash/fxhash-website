import type { NextPage } from "next"
import { useRef, useContext, useEffect } from "react"
import { Spacing } from "../components/Layout/Spacing"
import { SectionHeader } from "../components/Layout/SectionHeader"
import Head from "next/head"
import { SectionTitle } from "../components/Layout/SectionTitle"
import { useParams } from "../context/Params"
import { InputParams } from "tweakpane"
import { SectionWrapper } from "../components/Layout/SectionWrapper"
import { ConfigurationPane } from "../containers/Params/ConfigurationPane"

interface Props {
  params: InputParams
}

const ControllerPage: NextPage<Props> = ({ params }) => {
  return (
    <>
      <Head>
        <title>fxhash — sandbox</title>
        <meta key="og:title" property="og:title" content="fxhash — sandbox" />
        <meta
          key="description"
          name="description"
          content="Experiment and test your Generative Tokens in the Sandbox environment"
        />
        <meta
          key="og:description"
          property="og:description"
          content="Experiment and test your Generative Tokens in the Sandbox environment"
        />
      </Head>

      <Spacing size="6x-large" sm="3x-large" />

      <SectionWrapper layout="fixed-width-centered">
        <SectionTitle>Controller</SectionTitle>
        <Spacing size="2x-large" />
        <ConfigurationPane />
      </SectionWrapper>
    </>
  )
}

export async function getServerSideProps() {
  return {
    props: {
      params: {
        factor: 123,
        title: "hello",
        color: 0xff0055,
      },
    },
  }
}

export default ControllerPage
