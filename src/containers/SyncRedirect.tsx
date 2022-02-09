import { useRouter } from "next/router"
import style from "./SyncRedirect.module.scss"
import cs from "classnames"
import { Button } from "../components/Button"
import { useContext, useEffect } from "react"
import { UserContext } from "./UserProvider"
import { LinkGuide } from "../components/Link/LinkGuide"

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
export function SyncRedirect({ target }: Props) {
  const userCtx = useContext(UserContext)
  const router = useRouter()

  // plug to the user context to know if we have a connection
  useEffect(() => {
    if (userCtx.user) {
      // redirect to the page initially requested
      router.replace(target)
    }
  }, [userCtx.user])
  
  return (
    <div className={cs(style.container)}>
      <h4>You must sync your wallet to access this page/feature</h4>
      <Button
        size="large"
        className="btn-sync"
        iconComp={<i aria-hidden className="fas fa-wallet"/>}
        onClick={() => {
          userCtx.connect()
        }}
      >
        sync your wallet
      </Button>
      <p>
        <span>If you don't have a wallet, you can read our </span>
        <LinkGuide href="/doc/collect/guide">
          Guide to collect/mint tokens on fxhash
        </LinkGuide>
      </p>
    </div>
  )
}