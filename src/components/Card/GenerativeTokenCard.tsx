// import style from "./GenerativeTokenCard.module.scss"
import Link from "next/link"
import cs from "classnames"
import { GenerativeToken } from "../../types/entities/GenerativeToken"
import colors from "../../styles/Colors.module.css"
import { AnchorForward } from "../Utils/AnchorForward"
import { Card } from "./Card"
import { UserBadge } from "../User/UserBadge"
import { MintProgress } from "../Artwork/MintProgress"
import { Spacing } from "../Layout/Spacing"
import { getGenerativeTokenUrl } from "../../utils/generative-token"
import { displayMutez } from "../../utils/units"
import { useMemo, useState } from "react"
import { Countdown } from "../Utils/Countdown"


interface Props {
  token: GenerativeToken
  className?: string
  displayPrice?: boolean
  lockedUntil?: string
}

export function GenerativeTokenCard({
  token,
  displayPrice = false,
  className,
  lockedUntil,
}: Props) {
  const url = getGenerativeTokenUrl(token)
  const lockedUntilDate = useMemo<Date|null>(() => lockedUntil ? new Date(lockedUntil) : null, [lockedUntil])
  const [unlocked, setUnlocked] = useState<boolean>(false)

  return (
    <Link href={url} passHref>
      <AnchorForward style={{ height: '100%' }} className={className}>
        <Card thumbnailUri={token.metadata?.thumbnailUri}>
          <div>
            <h5>{ token.name }</h5>
            <Spacing size="2x-small" />
            <UserBadge user={token.author} size="regular" hasLink={false} />
          </div>
          <div>
            {lockedUntilDate && (
              <>
                <Spacing size="small" />
                {!unlocked ? (
                  <strong className={cs(colors.gray)}>
                    <span><i aria-hidden className="fas fa-lock"/> unlocks in </span>
                    <Countdown
                      until={lockedUntilDate}
                      onEnd={() => setUnlocked(true)}
                    />
                  </strong>
                ):(
                  <strong className={cs(colors.success)}>
                    <i aria-hidden className="fas fa-lock-open"/> unlocked
                  </strong>
                )}
              </>
            )}
            <Spacing size="small" />
            <MintProgress balance={token.balance} supply={token.supply} originalSupply={token.originalSupply}>
              {displayPrice && (
                <strong className={cs(colors.secondary)}>
                  {displayMutez(token.price, 4)} tez
                </strong>
              )}
            </MintProgress>
          </div>
        </Card>
      </AnchorForward>
    </Link>
  )
}
