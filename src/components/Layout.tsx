import Head from "next/head"
import style from "./Layout.module.scss"
import { PropsWithChildren } from "react"
import { Footer } from "./Footer"
import { Header } from "./Header"

export function Layout({ children }: PropsWithChildren<{}>) {
  return (
    <>
      <Head>
        <title>Example App</title>
      </Head>

      <Header />

      <main className={style.main}>
        {children}
      </main>
      
      <Footer />
    </>
  )
}