import { NextPage } from "next"
import { SectionHeader } from "../components/Layout/SectionHeader"
import { Spacing } from "../components/Layout/Spacing"
import cs from "classnames"
import layout from "../styles/Layout.module.scss"
import ClientOnly from "../components/Utils/ClientOnly"
import { UserGuard } from "../components/Guards/UserGuard"
import { MintGenerativeController } from "../containers/MintGenerative/Controller"
import { BrowserRouter as Router } from "react-router-dom"
import { useRef } from "react"
import Head from "next/head"
import { TitleHyphen } from "../components/Layout/TitleHyphen"

const MintGenerative: NextPage = () => {
  const anchorRef = useRef<HTMLElement>(null)

  return (
    <>
      <Head>
        <title>fxhash — mint Generative Token</title>
        <meta key="og:title" property="og:title" content="fxhash — mint Generative Token"/> 
        <meta key="description" name="description" content="Mint your generative Token"/>
      </Head>

      <Spacing size="6x-large"/>

      <section ref={anchorRef}>
        <SectionHeader>
          <TitleHyphen>mint a Generative Token</TitleHyphen>
        </SectionHeader>

        <Spacing size="x-large"/>

        <main className={cs(layout['padding-big'])}>
          <ClientOnly>
            <UserGuard>
              <Router basename="/mint-generative">
                <MintGenerativeController anchor={anchorRef} />
              </Router>
            </UserGuard>
          </ClientOnly>
        </main>
      </section>
    </>
  )
}

export default MintGenerative