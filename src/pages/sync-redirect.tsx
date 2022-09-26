import { GetServerSideProps, NextPage } from "next"
import { useMemo } from "react"
import { ClientOnlyEmpty } from "../components/Utils/ClientOnly"
import { SyncRedirect } from "../containers/SyncRedirect"

interface Props {
  target: string
}

/**
 * When a page/feature requires the user to have its wallet synced, it will be redirected to this page
 * to require him to sync its wallet to continue. If he succeeds, he will be redirected to the previous
 * page, otherwise it will be redirected to the home page.
 * To call this page, it is required to use history.replace so that this page can use history.back()
 * if sync fails / user wants to go back without getting stuck in a loop.
 * (create page How to create a Wallet)
 */
const SyncRedirectPage: NextPage<Props> = ({ target }) => {
  return (
    <ClientOnlyEmpty>
      <SyncRedirect target={target} />
    </ClientOnlyEmpty>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  // check if the query has a target, otherwise redirect to home page
  const target = context.query.target
  if (!target || typeof target === "object") {
    return {
      redirect: {
        destination: "/",
        permanent: true,
      },
    }
  }

  // otherwise we can process the target
  const targetDecoded = decodeURIComponent(target)

  return {
    props: {
      target: targetDecoded,
    },
  }
}

export default SyncRedirectPage
