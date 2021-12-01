// import style from "./Root.module.scss"
// import cs from "classnames"

import { ApolloProvider } from "@apollo/client"
import { PropsWithChildren } from "react"
import { Layout } from "../components/Layout"
import { clientSideClient } from "../services/ApolloClient"
import { UserProvider } from "./UserProvider"

export function Root({ children }: PropsWithChildren<{}>) {
  return (
    <ApolloProvider client={clientSideClient}>
      <UserProvider>
        <Layout>
          {children}
        </Layout>
      </UserProvider>
    </ApolloProvider>
  )
}