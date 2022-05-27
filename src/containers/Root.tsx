// import style from "./Root.module.scss"
// import cs from "classnames"

import { ApolloProvider } from "@apollo/client"
import { useRouter } from "next/router"
import { Fragment, PropsWithChildren, useMemo } from "react"
import { Layout } from "../components/Layout"
import { clientSideClient } from "../services/ApolloClient"
import { UserProvider } from "./UserProvider"
import { SettingsProvider } from "../context/Theme"
import { CyclesProvider } from "../context/Cycles"
import { MessageCenterProvider } from "../context/MessageCenter"
import { LaunchCountdown } from "./RareEvents/LaunchCountdown"
import { isLaunchCountdown } from "../utils/rare-events/launch"

const EXCLUDE_LAYOUT= [
  "/generative/[id]/enjoy",
  "/u/[name]/collection/enjoy",
  "/pkh/[id]/collection/enjoy"
]

export function Root({ children }: PropsWithChildren<{}>) {
  const router = useRouter()

  // should the page be renderer with the layout ?
  const LayoutWrapper = (EXCLUDE_LAYOUT.includes(router.pathname)) 
    ? Fragment 
    : Layout

  return (
    <ApolloProvider client={clientSideClient}>
      <SettingsProvider>
	<UserProvider>
	    <MessageCenterProvider>
	      <CyclesProvider>
		<LayoutWrapper>
		  {children}
		</LayoutWrapper>
	      </CyclesProvider>
	    </MessageCenterProvider>
        </UserProvider>
      </SettingsProvider>
    </ApolloProvider>
  )
}
