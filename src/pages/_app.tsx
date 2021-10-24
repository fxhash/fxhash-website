import '../styles/globals.scss'
import type { AppProps } from 'next/app'
import { Layout } from '../components/Layout'
import { clientSideClient } from '../services/ApolloClient'
import { ApolloProvider } from '@apollo/client'
import { UserProvider } from '../containers/UserProvider'
import { useEffect } from 'react'
import Head from "next/head"


function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <meta key="og:title" property="og:title" content="fxhash — blockchain generative art"/> 
        <meta key="description" name="description" content="fxhash is a platform to mint Generative Tokens on the Tezos blockchain"/>
        <meta key="og:description" property="og:description" content="fxhash is a platform to mint Generative Tokens on the Tezos blockchain"/>
        <meta key="og:type" property="og:type" content="website"/>
        <meta key="og:image" property="og:image" content="/images/og/og1.jpg"/>
      </Head>

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
