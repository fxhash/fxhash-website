import style from "./MintButton.module.scss"
import Link from "next/link"
import cs from "classnames"
import { GenerativeToken, GenTokFlag } from "../../types/entities/GenerativeToken"
import { Spacing } from "../Layout/Spacing"
import { Button, ButtonState } from "."
import { displayMutez } from "../../utils/units"
import { useContext, useMemo, useState } from "react"
import { Countdown } from "../Utils/Countdown"
import { distanceSecondsClamped } from "../../utils/time"
import { UserContext } from "../../containers/UserProvider"

interface Props {
  token: GenerativeToken
  isLink: boolean
  onClick?: () => void
  state?: ButtonState
}
export function MintButton({
  token,
  isLink,
  onClick,
  state,
}: Props) {
  const userContext = useContext(UserContext)
  // is the token hidden ?
  const isHidden = [GenTokFlag.MALICIOUS, GenTokFlag.HIDDEN].includes(token.flag) || token.balance === 0
  
  const lockEnd = useMemo(() => new Date(token.lockEnd), [token])
  
  // is the token locked ?
  const [isLocked, setIsLocked] = useState<boolean>(distanceSecondsClamped(new Date(), lockEnd) > 0)

  // is the token enabled ?
  const isEnabled = useMemo<boolean>(() => {
    // token is enabled if its state is enabled or if its disabled and author is the user
    return token.enabled || token.author.id === userContext.user?.id
  }, [token, userContext])

  // 
  console.log(token)

  return (
    <div className={cs(style.root)}>      
      {!isHidden && (
        <>
          {isLocked && (
            <>
              <strong>
                <span><i aria-hidden className="fas fa-lock"/> unlocks in </span>
                <Countdown
                  until={lockEnd}
                  onEnd={() => setIsLocked(false)}
                />
              </strong>
              <Spacing size="8px"/>
            </>
          )}

          {!token.enabled && <small>token is currently <strong>disabled</strong> by author</small>}

          {isLink ? (
            <Link href={`/mint/${token.id}`} passHref>
              <Button
                isLink
                color="secondary"
                disabled={!isEnabled || isLocked}
              >
                mint unique token — {displayMutez(token.price)} tez
              </Button>
            </Link>
          ):(
            <Button
              type="button"
              color="secondary"
              disabled={!isEnabled || isLocked}
              onClick={onClick}
              state={state || "default"}
            >
              mint unique token — {displayMutez(token.price)} tez
            </Button>
          )}

          {!token.enabled && isEnabled && <small>as the author, you can still mint</small>}
        </>
      )}
    </div>
  )
}