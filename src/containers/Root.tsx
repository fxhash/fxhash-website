// import style from "./Root.module.scss"
// import cs from "classnames"

import { ApolloProvider } from "@apollo/client"
import { useRouter } from "next/router"
import { Fragment, PropsWithChildren } from "react"
import { Layout } from "../components/Layout"
import { clientSideClient } from "../services/ApolloClient"
import { UserProvider } from "./UserProvider"

const EXCLUDE_LAYOUT= [
  "/generative/[id]/enjoy",
  "/u/[name]/collection/enjoy"
]

export function Root({ children }: PropsWithChildren<{}>) {
  const router = useRouter()

  // should the page be renderer with the layout ?
  const LayoutWrapper = EXCLUDE_LAYOUT.includes(router.pathname) ? Fragment : Layout

  return (
    <ApolloProvider client={clientSideClient}>
      <UserProvider>
        <LayoutWrapper>
          {children}
        </LayoutWrapper>
      </UserProvider>
    </ApolloProvider>
  )
}