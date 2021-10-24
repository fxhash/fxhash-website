// import style from "./GenerativeTokenCard.module.scss"
import Link from "next/link"
import cs from "classnames"
import { GenerativeToken } from "../../types/entities/GenerativeToken"
import { AnchorForward } from "../Utils/AnchorForward"
import { Card } from "./Card"
import { UserBadge } from "../User/UserBadge"
import { MintProgress } from "../Artwork/MintProgress"
import { Spacing } from "../Layout/Spacing"

interface Props {
  token: GenerativeToken
}

export function GenerativeTokenCard({
  token
}: Props) {
  return (
    <Link href={`/generative/${token.id}`} passHref>
      <AnchorForward style={{ height: '100%' }}>
        <Card thumbnailUri={token.metadata?.thumbnailUri}>
          <div>
            <h5>{ token.name }</h5>
            <Spacing size="2x-small" />
            <UserBadge user={token.author} size="regular" hasLink={false} />
          </div>
          <div>
            <Spacing size="small" />
            <MintProgress balance={token.balance} supply={token.supply} />
          </div>
        </Card>
      </AnchorForward>
    </Link>
  )
}