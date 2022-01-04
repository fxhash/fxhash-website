// import style from "./GenerativeTokenCard.module.scss"
import Link from "next/link"
import colors from "../../styles/Colors.module.css"
import cs from "classnames"
import { AnchorForward } from "../Utils/AnchorForward"
import { Card } from "./Card"
import { UserBadge } from "../User/UserBadge"
import style from "./Card.module.scss"
import styleObjkt from "./ObjktCard.module.scss"
import { Spacing } from "../Layout/Spacing"
import { Objkt } from "../../types/entities/Objkt"
import { displayMutez } from "../../utils/units"
import { getObjktUrl } from "../../utils/objkt"
import { GenTokFlag } from "../../types/entities/GenerativeToken"

interface Props {
  objkt: Objkt
}

export function ObjktCard({
  objkt
}: Props) {
  const url = getObjktUrl(objkt)

  return (
    <Link href={url} passHref>
      <AnchorForward style={{ height: '100%' }}>
        <Card thumbnailUri={objkt.metadata?.thumbnailUri} undesirable={objkt.issuer.flag === GenTokFlag.MALICIOUS}>
          <div>
            {objkt.duplicate && <div className={cs(styleObjkt.dup_flag)}>[WARNING: DUPLICATE]</div>}
            <h5>{ objkt.name }{objkt.assigned === false && ` - ${objkt.issuer.name}`}</h5>
            <Spacing size="2x-small" />
            <UserBadge user={objkt.owner!} size="regular" hasLink={false} />
          </div>

          <Spacing size="small" />

          <div className={cs(style.bottom)}>
            <div className={cs(style.price)}>
              {objkt.offer && (
                <>{displayMutez(objkt.offer.price)} tez</>
              )}
            </div>
            <div className={cs(style.badge)}>
              <span className={cs(colors['gray-dark'])}>created by</span> 
              <UserBadge user={objkt.issuer.author} size="regular" hasLink={false} avatarSide="right" />
            </div>
          </div>
        </Card>
      </AnchorForward>
    </Link>
  )
}