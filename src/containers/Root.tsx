// import style from "./Root.module.scss"
// import cs from "classnames"

import { ApolloProvider } from "@apollo/client"
import { useRouter } from "next/router"
import { Fragment, PropsWithChildren } from "react"
import { Layout } from "../components/Layout/Layout"
import { clientSideClient } from "../services/ApolloClient"
import { UserProvider } from "./UserProvider"
import { SettingsProvider } from "../context/Theme"
import { CyclesProvider } from "../context/Cycles"
import { MessageCenterProvider } from "../context/MessageCenter"
import { ArticlesProvider } from "../context/Articles"
import { matchRule } from "../utils/regex"
import { IndexerStatusProvider } from "../context/IndexerStatus"
import { IndexerStatus, NetworkStatus } from "../types/IndexerStatus"
import { ModalProvider } from "../context/Modal"
const EXCLUDE_LAYOUT = [
  "/generative/slug/[slug]/ticket/[ticketId]/mint",
  "/generative/[id]/enjoy",
  "/u/[name]/collection/enjoy",
  "/pkh/[id]/collection/enjoy",
  "/live-minting/*",
  "/password-protection",
]

export function Root({
  children,
  indexerStatus,
  networkStatus,
}: PropsWithChildren<{
  indexerStatus?: IndexerStatus
  networkStatus?: NetworkStatus
}>) {
  const router = useRouter()

  // should the page be renderer with the layout ?
  const LayoutWrapper = EXCLUDE_LAYOUT.some((rule) =>
    matchRule(rule, router.pathname)
  )
    ? Fragment
    : Layout

  return (
    <ApolloProvider client={clientSideClient}>
      <SettingsProvider>
        <UserProvider>
          <MessageCenterProvider>
            <IndexerStatusProvider
              indexerStatus={indexerStatus}
              networkStatus={networkStatus}
            >
              <CyclesProvider>
                <ModalProvider>
                  <ArticlesProvider>
                    <LayoutWrapper>{children}</LayoutWrapper>
                  </ArticlesProvider>
                </ModalProvider>
              </CyclesProvider>
            </IndexerStatusProvider>
          </MessageCenterProvider>
        </UserProvider>
      </SettingsProvider>
    </ApolloProvider>
  )
}
