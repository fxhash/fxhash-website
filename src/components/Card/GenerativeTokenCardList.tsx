import style from "./GenerativeTokenCardList.module.scss"
import cs from "classnames"
import Link from "next/link"
import { GenerativeToken } from "../../types/entities/GenerativeToken"
import { AnchorForward } from "../Utils/AnchorForward"
import { UserBadge } from "../User/UserBadge"
import { Spacing } from "../Layout/Spacing"
import { getGenerativeTokenUrl } from "../../utils/generative-token"
import { CardList } from "./CardList"
import { displayMutez } from "../../utils/units"

interface Props {
  token: GenerativeToken
  className?: string
  url?: string
}

export function GenerativeTokenCardList({
  token,
  url,
  className,
}: Props) {
  url = url || getGenerativeTokenUrl(token)
  
  return (
    <Link href={url} passHref>
      <AnchorForward style={{ height: '100%' }} className={className}>
        <CardList thumbnailUri={token.metadata?.thumbnailUri}>
          <div>
            <h6>{ token.name }</h6>
            <Spacing size="8px" />
            <UserBadge user={token.author} size="small" hasLink={false} />
          </div>
          <div className={cs(style.details)}>
            <div className={cs(style.metric)}>
              <span>Floor</span>
              <strong>{ token.marketStats?.floor && `${displayMutez(token.marketStats.floor)} tez` || "/" }</strong>
            </div>
            <div className={cs(style.metric)}>
              <span>For sale</span>
              <strong>{ token.marketStats?.listed || "0" }</strong>
            </div>
            <div className={cs(style.metric, style.progress)}>
              <span>Minted</span>
              <strong>
                <span className={cs(style.minted)}>{token.supply-token.balance}</span>
                <span className={cs(style.supply, { [style.minted_done]: token.balance === 0 })}>/{token.supply}</span>
              </strong>
            </div>
          </div>
        </CardList>
      </AnchorForward>
    </Link>
  )
}