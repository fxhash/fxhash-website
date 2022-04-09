import { useRouter } from "next/router"
import { useContext, useEffect, PropsWithChildren } from "react"
import { UserContext } from "../../containers/UserProvider"
import { ConnectedUser } from "../../types/entities/User"


interface Props {
  forceRedirect?: boolean
  allowed?: (user: ConnectedUser) => boolean
}

export function UserGuard({
  forceRedirect = true,
  allowed,
  children
}: PropsWithChildren<Props>) {
  const userCtx = useContext(UserContext)
  const router = useRouter()

  useEffect(() => {
    if (forceRedirect && userCtx.autoConnectChecked) {
      if (!userCtx.user) {
        router.push(`/sync-redirect?target=${encodeURIComponent(router.asPath)}`)
      }
      else if (allowed && !allowed(userCtx.user)) {
        router.push(`/`)
      }
    }
  }, [userCtx])

  return userCtx.user ? <>{children}</> : null
}