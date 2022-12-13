import React, { useContext } from "react"
import { NextPage } from "next"
import Head from "next/head"
import { UserContext } from "../../containers/UserProvider";

const Me: NextPage = () => {
  const { user, userFetched } = useContext(UserContext)
  return (
    <>
      <Head>
        <title>fxhash — me</title>
        <meta key="og:title" property="og:title" content="fxhash — me" />
      </Head>
      <section>
        loading
      </section>
    </>
  )
}
