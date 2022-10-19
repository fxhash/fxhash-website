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
import { ParamsProvider } from "../context/Params"
const EXCLUDE_LAYOUT = [
  "/generative/[id]/enjoy",
  "/u/[name]/collection/enjoy",
  "/pkh/[id]/collection/enjoy",
  "/live-minting/*",
]

export function Root({ children }: PropsWithChildren<{}>) {
  const router = useRouter()

  // should the page be renderer with the layout ?
  const LayoutWrapper = EXCLUDE_LAYOUT.some((rule) =>
    matchRule(rule, router.pathname)
  )
    ? Fragment
    : Layout

  return (
    <ApolloProvider client={clientSideClient}>
      <ParamsProvider>
        <SettingsProvider>
          <UserProvider>
            <MessageCenterProvider>
              <CyclesProvider>
                <ArticlesProvider>
                  <LayoutWrapper>{children}</LayoutWrapper>
                </ArticlesProvider>
              </CyclesProvider>
            </MessageCenterProvider>
          </UserProvider>
        </SettingsProvider>
      </ParamsProvider>
    </ApolloProvider>
  )
}
