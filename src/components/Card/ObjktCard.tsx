// import style from "./GenerativeTokenCard.module.scss"
import Link from "next/link"
import cs from "classnames"
import { AnchorForward } from "../Utils/AnchorForward"
import { Card } from "./Card"
import { UserBadge } from "../User/UserBadge"
import style from "./Card.module.scss"
import { Spacing } from "../Layout/Spacing"
import { Objkt } from "../../types/entities/Objkt"

interface Props {
  objkt: Objkt
}

export function ObjktCard({
  objkt
}: Props) {
  const owner = objkt.offer ? objkt.offer.issuer : objkt.owner!

  return (
    <Link href="/test" passHref>
      <AnchorForward style={{ height: '100%' }}>
        <Card thumbnailUri={objkt.metadata?.displayUri}>
          <div>
            <h5>{ objkt.name }</h5>
            <Spacing size="2x-small" />
            <UserBadge user={owner} size="regular" hasLink={false} />
          </div>
          <div>
            <Spacing size="small" />
            <div className={cs(style.price)}>120 tez</div>
          </div>
        </Card>
      </AnchorForward>
    </Link>
  )
}