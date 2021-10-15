import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { Layout } from '../components/Layout'
import Client from '../services/ApolloClient'
import { ApolloProvider } from '@apollo/client'
import { UserProvider } from '../containers/UserProvider'
import { useEffect } from 'react'


function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ApolloProvider client={Client}>
      <UserProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </UserProvider>
    </ApolloProvider>
  )
}
export default MyApp
