import { useRouter } from "next/router"
import { useContext, useEffect, PropsWithChildren, useMemo } from "react"
import { UserContext } from "../../containers/UserProvider"
import { ConnectedUser, User } from "../../types/entities/User"
import { isUserOrCollaborator } from "../../utils/user"


// a collection of basic authorization utilities as factory functions
export const UserGuardUtils: Record<
  string, 
  (...args: any[]) => (user: ConnectedUser) => boolean
> = {
  AUTHOR_OF: (author: User) => (user: ConnectedUser) => {
    return user && author && isUserOrCollaborator(user as User, author)
  }
}

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

  const isAllowed = useMemo(() => {
    if (userCtx.user && userCtx.userFetched) {
      if (allowed) {
        return allowed(userCtx.user)
      }
      return true
    }
    return false
  }, [userCtx, allowed])

  // handle re-routing if needed (forceRedirect is set to true)
  // * no user in context
  // * user in context but not allowed
  useEffect(() => {
    if (forceRedirect && userCtx.autoConnectChecked) {
      if (!userCtx.user) {
        router.push(`/sync-redirect?target=${encodeURIComponent(router.asPath)}`)
      }
      else if (userCtx.userFetched && !isAllowed) {
        router.push(`/`)
      }
    }
  }, [isAllowed, forceRedirect, router, userCtx])

  return isAllowed ? <>{children}</> : null
}
