// import style from "./Root.module.scss"
// import cs from "classnames"

import { ApolloProvider } from "@apollo/client"
import { NextRouter, useRouter } from "next/router"
import { Fragment, PropsWithChildren, useCallback } from "react"
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
import { usePlausible } from "hooks/usePlausible"
import { useMatomo } from "hooks/useMatomo"
import { useTrackPageView } from "hooks/useTrackPageView"

const EXCLUDE_LAYOUT = [
  "/generative/slug/[slug]/ticket/[ticketId]/mint",
  "/generative/[id]/explore-params",
  "/generative/slug/[slug]/explore-params",
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

  // initialise tracking services
  const plausible = usePlausible()
  const matomo = useMatomo()

  const handleTrackPageView = useCallback(
    (router: NextRouter) => {
      plausible.handleTrackPageView(router)
      matomo.handleTrackPageView(router)
    },
    [matomo, plausible]
  )

  useTrackPageView(handleTrackPageView)

  return (
    <ApolloProvider client={clientSideClient}>
      <SettingsProvider>
        <MessageCenterProvider>
          <UserProvider>
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
          </UserProvider>
        </MessageCenterProvider>
      </SettingsProvider>
    </ApolloProvider>
  )
}
