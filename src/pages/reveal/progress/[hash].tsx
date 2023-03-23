import { GetServerSideProps, NextPage } from "next"
import Head from "next/head"
import { Spacing } from "../../../components/Layout/Spacing"
import layout from "../../../styles/Layout.module.scss"
import cs from "classnames"
import { RevealProgress } from "../../../containers/Reveal/RevealProgress"
import { GenerativeToken } from "../../../types/entities/GenerativeToken"
import { useRouter } from "next/router"

interface Props {
  hash: string
  token: GenerativeToken
}

const RevealProgressPage: NextPage<Props> = (props) => {
  const router = useRouter()
  const { hash } = router.query

  return (
    <>
      <Head>
        <title>fxhash — signing progress</title>
        <meta
          key="og:title"
          property="og:title"
          content="fxhash — signing progress"
        />
        <meta
          key="description"
          name="description"
          content="Monitor the signing progress of a token"
        />
        <meta
          key="og:description"
          property="og:description"
          content="Monitor the signing progress of a token"
        />
        <meta key="og:type" property="og:type" content="website" />
        <meta
          key="og:image"
          property="og:image"
          content="https://www.fxhash.xyz/images/og/og1.jpg"
        />
      </Head>

      <section>
        <Spacing size="6x-large" />
        <main className={cs(layout["padding-big"])}>
          <RevealProgress hash={hash as string} onRevealed={() => {}} />
        </main>
      </section>

      <Spacing size="6x-large" />
      <Spacing size="6x-large" />
      <Spacing size="6x-large" />
    </>
  )
}

export default RevealProgressPage
