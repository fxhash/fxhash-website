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
import { IParameterDefinition } from "../context/tweakpane/index"

interface Props {
  params: IParameterDefinition[]
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
        <ConfigurationPane params={params} />
      </SectionWrapper>
    </>
  )
}

const TEST_PARAMS: IParameterDefinition[] = [
  {
    name: "string_name",
    type: "string",
    id: "string_id",
    default: "hello world",
    options: {},
  },
  {
    name: "number_name",
    type: "number",
    id: "number_id",
    default: "0",
    options: {},
  },
  {
    name: "boolean_name",
    type: "boolean",
    id: "boolean_id",
    default: "false",
    options: {},
  },
]

export async function getServerSideProps() {
  return {
    props: {
      params: TEST_PARAMS,
    },
  }
}

export default ControllerPage
