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
import { useContext } from "react"
import { SettingsContext } from "../../context/Theme"
import { DisplayTezos } from "../Display/DisplayTezos"
import { EntityBadge } from "../User/EntityBadge"

interface Props {
  objkt: Objkt
  showOwner?: boolean
  showRarity?: boolean
}

export function ObjktCard({
  objkt,
  showOwner = true,
  showRarity = false,
}: Props) {
  const url = getObjktUrl(objkt)
  const settings = useContext(SettingsContext)

  return (
    <Link href={url} passHref>
      <AnchorForward style={{ height: '100%' }}>
        <Card
          thumbnailUri={objkt.metadata?.thumbnailUri} 
          undesirable={objkt.issuer?.flag === GenTokFlag.MALICIOUS}
          displayDetails={settings.displayInfosGentkCard}
        >
          <div>
            {objkt.duplicate && <div className={cs(styleObjkt.dup_flag)}>[WARNING: DUPLICATE]</div>}
            <h5>{ objkt.name }</h5>
            {showOwner && (
              <>
                <Spacing size="2x-small" />
                <UserBadge user={objkt.owner!} size="regular" hasLink={false} />
              </>
            )}
            {showRarity && objkt.rarity != null && (
              <>
                <Spacing size="2x-small" />
                <div className={cs(styleObjkt.rarity)}>
                  Rarity: { objkt.rarity.toFixed(3) }
                </div>
              </>
            )}
          </div>

          <Spacing size="small" />

          <div className={cs(style.bottom)}>
            <div className={cs(style.bottom_left)}>
              <div className={cs(style.price)}>
                {objkt.activeListing && (
                  <DisplayTezos
                    mutez={objkt.activeListing.price!}
                    formatBig={false}
                  />
                )}
              </div>
            </div>
            {objkt.issuer && (
              <div className={cs(style.badge)}>
                <span className={cs(colors['gray-dark'])}>created by</span> 
                <EntityBadge
                  user={objkt.issuer.author!}
                  size="regular"
                  hasLink={false}
                  avatarSide="right"
                />
              </div>
            )}
          </div>
        </Card>
      </AnchorForward>
    </Link>
  )
}