import "../styles/globals.scss"
import "../styles/fonts.css"

import { useRouter } from "next/router"
import { AppProps } from "next/app"
import dynamic from "next/dynamic"

const DynamicApp = dynamic<AppProps>(() => {
  return import("containers/App").then((mod) => mod.App)
})

const App = (props: AppProps) => {
  const router = useRouter()
  if (router.pathname === "/password-protection") {
    const { Component, pageProps } = props
    return <Component {...pageProps} />
  }
  return <DynamicApp {...props} />
}
export default App
