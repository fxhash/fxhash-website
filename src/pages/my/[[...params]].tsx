import React, { useContext, useEffect } from "react"
import Head from "next/head"
import { UserContext } from "../../containers/UserProvider"
import { LoaderBlock } from "../../components/Layout/LoaderBlock"
import { useRouter } from "next/router"
import { Spacing } from "../../components/Layout/Spacing"
import cs from "classnames"
import layout from "../../styles/Layout.module.scss"

export default function My() {
  const router = useRouter()
  const { user, userFetched, autoConnectChecked } = useContext(UserContext)

  useEffect(() => {
    if (user && userFetched) {
      const myReplacement = user.name ? `u/${user.name}` : `pkh/${user.id}`
      const path = `/${myReplacement}${router.asPath.slice(3)}`
      router.replace(path, path)
      return
    }
  }, [router, user, userFetched])
  return (
    <>
      <Head>
        <title>fxhash — my</title>
        <meta key="og:title" property="og:title" content="fxhash — my" />
      </Head>
      <main className={cs(layout["padding-big"], layout.y_centered)}>
        <Spacing size="3x-large" />
        {user && <LoaderBlock />}
        {!user && !userFetched && autoConnectChecked && (
          <p className={layout.text_centered}>
            Connect your wallet to access your profile
          </p>
        )}
      </main>
    </>
  )
}
