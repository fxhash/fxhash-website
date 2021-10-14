import { useRouter } from "next/router"
import { useContext, useEffect, PropsWithChildren } from "react"
import { UserContext } from "../../containers/UserProvider"


interface Props {
  redirect?: string
}

export function UserGuard({
  redirect = "/",
  children
}: PropsWithChildren<Props>) {
  const userCtx = useContext(UserContext)
  const router = useRouter()

  useEffect(() => {
    if (userCtx.autoConnectChecked && !userCtx.user) {
      router.push(redirect)
    }
  }, [userCtx])

  return userCtx.user ? <>{children}</> : null
}