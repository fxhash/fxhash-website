import Head from "next/head"
import style from "./Layout.module.scss"
import { PropsWithChildren } from "react"
import { Footer } from "../containers/Footer/Footer"
import { Header } from "./Header"
import { Warning } from "./Layout/Warning"

export function Layout({ children }: PropsWithChildren<{}>) {
  return (
    <>
      {process.env.NEXT_PUBLIC_BETA_MODE === "on" && (
        <Warning>
          <span dangerouslySetInnerHTML={{ __html: process.env.NEXT_PUBLIC_BANNER_MESSAGE! }}/>
        </Warning>
      )}

      <Header />

      <main className={style.main}>
        {children}
      </main>
      
      <Footer />
    </>
  )
}