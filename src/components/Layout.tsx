import style from "./Layout.module.scss"
import { PropsWithChildren } from "react"
import { Footer } from "../containers/Footer/Footer"
import { Header } from "./Header"
import { TopBanner } from "./TopBanner"

export function Layout({ children }: PropsWithChildren<{}>) {
  return (
    <>
      {process.env.NEXT_PUBLIC_BETA_MODE === "on" && (
        <TopBanner message={process.env.NEXT_PUBLIC_BANNER_MESSAGE} />
      )}

      <Header />

      <main className={style.main}>{children}</main>

      <Footer />
    </>
  )
}
