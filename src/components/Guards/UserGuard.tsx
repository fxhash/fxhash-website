import { useRouter } from "next/router"
import { useContext, useEffect, PropsWithChildren } from "react"
import { UserContext } from "../../containers/UserProvider"


interface Props {
  forceRedirect?: boolean
}

export function UserGuard({
  forceRedirect = true,
  children
}: PropsWithChildren<Props>) {
  const userCtx = useContext(UserContext)
  const router = useRouter()

  useEffect(() => {
    if (forceRedirect && userCtx.autoConnectChecked && !userCtx.user) {
      router.push(`/sync-redirect?target=${encodeURIComponent(router.asPath)}`)
    }
  }, [userCtx])

  return userCtx.user ? <>{children}</> : null
}