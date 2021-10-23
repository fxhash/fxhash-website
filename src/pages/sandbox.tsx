import type { NextPage } from 'next'
import layout from '../styles/Layout.module.scss'
import cs from 'classnames'
import { Spacing } from '../components/Layout/Spacing'
import { SectionHeader } from '../components/Layout/SectionHeader'
import ClientOnly from '../components/Utils/ClientOnly'
import { Sandbox } from '../containers/Sandbox/Sandbox'
import Head from 'next/head'
import { LinkGuide } from '../components/Link/LinkGuide'



const SandboxPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>fxhash — sandbox</title>
        <meta key="og:title" property="og:title" content="fxhash — sandbox"/> 
        <meta key="description" property="description" content="Experiment and test your Generative Tokens in the Sandbox environment"/>
        <meta key="og:description" property="og:description" content="Experiment and test your Generative Tokens in the Sandbox environment"/>
      </Head>

      <Spacing size="6x-large" />

      <section>
        <SectionHeader>
          <h2>— sandbox</h2>
        </SectionHeader>

        <Spacing size="x-large"/>

        <main className={cs(layout['padding-big'])}>
          <p>
            The sandbox is a space in which you can drop a .zip of your project and see how it would behave when it will be minted on ixart. 
            If your artwork does not behave properly in the sandbox, it will not work after being minted. <br/>
            <span>If you are new to the platform please read our </span>
            <LinkGuide href="/articles/guide-mint-generative-token">
              Guide to build a Generative Token.
            </LinkGuide>
          </p>

          <Spacing size="3x-large"/>

          <ClientOnly>
            <Sandbox />
          </ClientOnly>
        </main>
      </section>

      <Spacing size="6x-large" />
      <Spacing size="6x-large" />
      <Spacing size="6x-large" />
    </>
  )
}

export default SandboxPage
