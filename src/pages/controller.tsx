import type { NextPage } from "next"
import { useRef, useContext, useEffect } from "react"
import layout from "../styles/Layout.module.scss"
import cs from "classnames"
import { Spacing } from "../components/Layout/Spacing"
import { SectionHeader } from "../components/Layout/SectionHeader"
import ClientOnly from "../components/Utils/ClientOnly"
import { Sandbox } from "../containers/Sandbox/Sandbox"
import Head from "next/head"
import { LinkGuide } from "../components/Link/LinkGuide"
import { SectionTitle } from "../components/Layout/SectionTitle"
import { useTweaks } from "use-tweaks"
import { ParamsContext } from "../context/Params"

function useParams(parameters) {
  const params = useContext(ParamsContext)
  useEffect(() => {
    params.setParams(parameters)
  }, [])
  return params
}

const ControllerPage: NextPage = () => {
  const ref = useRef(null)

  const params = useParams({
    factor: 123,
    title: "hello",
    color: 0xff0055,
  })
  console.log(params)

  /*
  const { speed, factor } = useTweaks(
    {
      speed: 1,
      factor: { value: 1, min: 10, max: 100 },
    },
    { container: ref }
  )

  console.log(speed)
   */
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

      <section>
        <SectionHeader>
          <SectionTitle>Controller</SectionTitle>
        </SectionHeader>
        <div ref={ref} id="someContainer" />
      </section>

      <Spacing size="6x-large" sm="5x-large" />
      <Spacing size="6x-large" sm="none" />
      <Spacing size="6x-large" sm="none" />
    </>
  )
}

export default ControllerPage
