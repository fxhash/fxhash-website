import style from "./LaunchCountdown.module.scss"
import cs from "classnames"
import { PropsWithChildren, useMemo, useRef, useState } from "react"
import { Countdown } from "../../components/Utils/Countdown"
import { useRouter } from "next/router"
import { LinkGuide } from "../../components/Link/LinkGuide"
import { Button } from "../../components/Button"
import { useClientEffect } from "../../utils/hookts"
import { lerp } from "../../utils/math"

interface Props {
  active: boolean
}
export function LaunchCountdown({
  active,
  children,
}: PropsWithChildren<Props>) {
  // allows page to be reloaded to open full website
  const [unlock, setUnlock] = useState<boolean>(false)
  // the unlock button
  const buttonRef = useRef<HTMLButtonElement & HTMLAnchorElement>(null)
  // the trick memory
  const trickPos = useRef({ x: 0, y: 0 })
  // button hovered
  const buttonHovered = useRef(false)

  const router = useRouter()

  useClientEffect(() => {
    if (active) {
      const list = (evt: MouseEvent) => {
        if (buttonRef.current && !buttonHovered.current) {
          const X = evt.clientX / window.innerWidth - 0.5
          const Y = evt.clientY / window.innerHeight - 0.5
          const a = Math.atan2(Y, X) - Math.PI * 0.5
          const W = Math.min(window.innerWidth * 0.3, window.innerHeight * 0.4)
          const X2 = Math.cos(a) * W
          const Y2 = Math.sin(a) * W
          trickPos.current.x = lerp(trickPos.current.x, X2, 0.02)
          trickPos.current.y = lerp(trickPos.current.y, Y2, 0.02)

          buttonRef.current.style.transform = `translate(${trickPos.current.x}px, ${trickPos.current.y}px)`
        }
      }

      document.addEventListener("mousemove", list)

      return () => {
        document.removeEventListener("mousemove", list)
      }
    }
  }, [active])

  // timer is counting until ...
  const until = useMemo(
    () => new Date(process.env.NEXT_PUBLIC_LAUNCH_TIME || 0),
    []
  )

  // are we on a documentation page ?
  const isDoc = useMemo(() => /^\/doc/.test(router.pathname), [router.pathname])

  return (
    <>
      {active && !isDoc ? (
        <div className={cs(style.root)}>
          {unlock ? (
            <Button
              type="button"
              size="regular"
              onClick={() => window.location.replace("/")}
              ref={buttonRef}
              style={{
                transition: "none !important",
              }}
              onMouseOver={() => (buttonHovered.current = true)}
              onMouseLeave={() => (buttonHovered.current = false)}
            >
              enter fxhash 1.0
            </Button>
          ) : (
            <>
              <h1>fxhash 1.0 is coming soon</h1>
              <span className={cs(style.countdown)}>
                <Countdown
                  until={until}
                  onEnd={() => setUnlock(true)}
                  showFull
                />
              </span>
              <LinkGuide href="/doc">documentation</LinkGuide>
            </>
          )}
        </div>
      ) : (
        children
      )}
    </>
  )
}
