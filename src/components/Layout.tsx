import Head from "next/head"
import style from "./Layout.module.scss"
import { PropsWithChildren } from "react"
import { Footer } from "./Footer"
import { Header } from "./Header"
import { Warning } from "./Layout/Warning"

export function Layout({ children }: PropsWithChildren<{}>) {
  return (
    <>
      {process.env.NEXT_PUBLIC_BETA_MODE === "on" && (
        <Warning>
          <span><strong>Warning</strong>: fx hash is in BETA mode. More about it by clicking this banner</span>
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