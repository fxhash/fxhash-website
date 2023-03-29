import "../styles/globals.scss"
import "../styles/fonts.css"
import "@fortawesome/fontawesome-svg-core/styles.css"
import { AppProps } from "next/app"
import { useRouter } from "next/router"
import dynamic from "next/dynamic"
import { useTransitionStyleFix } from "../hooks/useTransitionStyleFix"

const DynamicApp = dynamic<AppProps>(() => {
  return import("containers/App").then((mod) => mod.App)
})

const App = (props: AppProps) => {
  const router = useRouter()

  useTransitionStyleFix()

  if (router.pathname === "/password-protection") {
    const { Component, pageProps } = props
    return <Component {...pageProps} />
  }

  return <DynamicApp {...props} />
}

export default App
