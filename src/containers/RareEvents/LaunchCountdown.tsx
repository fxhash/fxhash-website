import style from "./LaunchCountdown.module.scss"
import cs from "classnames"
import { PropsWithChildren, useMemo, useState } from "react"
import { Countdown } from "../../components/Utils/Countdown"
import { useRouter } from "next/router"
import { LinkGuide } from "../../components/Link/LinkGuide"
import { Button } from "../../components/Button"

interface Props {
  active: boolean
}
export function LaunchCountdown({
  active,
  children,
}: PropsWithChildren<Props>) {
  // allows page to be reloaded to open full website
  const [unlock, setUnlock] = useState<boolean>(false)

  const router = useRouter()

  // timer is counting until ...
  const until = useMemo(
    () => new Date(process.env.NEXT_PUBLIC_LAUNCH_TIME || 0),
    []
  )

  // are we on a documentation page ?
  const isDoc = useMemo(
    () => /^\/doc/.test(router.pathname),
    [router.pathname]
  )

  return (
    <>
      {active && !isDoc ? (
        <div className={cs(style.root)}>
          {unlock ? (
            <Button
              type="button"
              size="large"
              onClick={() => window.location.replace("/")}
            >
              enter fxhash 1.0
            </Button>
          ):(
            <>
              <h1>fxhash 1.0 is coming soon</h1>
              <span className={cs(style.countdown)}>
                <Countdown
                  until={until}
                  onEnd={() => setUnlock(true)}
                  showFull
                />
              </span>
              <LinkGuide href="/doc">
                documentation
              </LinkGuide>
            </>
          )}
        </div>
      ):(
        children
      )}
    </>
  )
}