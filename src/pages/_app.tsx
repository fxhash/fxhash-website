import '../styles/globals.scss'
import type { AppProps, NextWebVitalsMetric } from 'next/app'
import { Layout } from '../components/Layout'
import { clientSideClient } from '../services/ApolloClient'
import { ApolloProvider } from '@apollo/client'
import { UserProvider } from '../containers/UserProvider'
import NextNprogress from 'nextjs-progressbar'
import Head from "next/head"


function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <meta key="og:title" property="og:title" content="fxhash — blockchain generative art"/> 
        <meta key="description" name="description" content="fxhash is a platform to mint Generative Tokens on the Tezos blockchain"/>
        <meta key="og:description" property="og:description" content="fxhash is a platform to mint Generative Tokens on the Tezos blockchain"/>
        <meta key="og:type" property="og:type" content="website"/>
        <meta key="og:image" property="og:image" content="https://www.fxhash.xyz/images/og/og1.jpg"/>

        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png"/>
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png"/>
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png"/>
        <link rel="manifest" href="/site.webmanifest"/>
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5"/>
        <meta name="msapplication-TileColor" content="#ffffff"/>
        <meta name="theme-color" content="#ffffff"></meta>
      </Head>

      <NextNprogress color="#7000FF" />

      <ApolloProvider client={clientSideClient}>
        <UserProvider>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </UserProvider>
      </ApolloProvider>
    </>
  )
}

export default MyApp