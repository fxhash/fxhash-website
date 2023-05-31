// import style from "./GenerativeTokenCard.module.scss"
import Link from "next/link"
import text from "styles/Text.module.css"
import colors from "../../styles/Colors.module.css"
import cs from "classnames"
import { AnchorForward } from "../Utils/AnchorForward"
import { Card } from "./Card"
import { UserBadge } from "../User/UserBadge"
import style from "./Card.module.scss"
import styleObjkt from "./ObjktCard.module.scss"
import { Spacing } from "../Layout/Spacing"
import { Objkt } from "../../types/entities/Objkt"
import { getObjktUrl } from "../../utils/objkt"
import { GenTokFlag } from "../../types/entities/GenerativeToken"
import { useContext } from "react"
import { SettingsContext } from "../../context/Theme"
import { DisplayTezos } from "../Display/DisplayTezos"
import { EntityBadge } from "../User/EntityBadge"
import { RedeemableIndicator } from "./RedeemableIndicator"

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
      <AnchorForward style={{ height: "100%" }}>
        <Card
          tokenLabels={objkt.issuer?.labels}
          image={objkt.captureMedia}
          thumbnailUri={objkt.metadata?.thumbnailUri}
          undesirable={objkt.issuer?.flag === GenTokFlag.MALICIOUS}
          displayDetails={settings.displayInfosGentkCard}
        >
          <div>
            {objkt.duplicate && (
              <div className={cs(styleObjkt.dup_flag)}>
                [WARNING: DUPLICATE]
              </div>
            )}
            <h5 className={styleObjkt.title}>{objkt.name}</h5>
            {showOwner && (
              <>
                <Spacing size="2x-small" sm="x-small" />
                <UserBadge user={objkt.owner!} size="regular" hasLink={false} />
              </>
            )}
            {showRarity && objkt.rarity != null && (
              <>
                <Spacing size="2x-small" />
                <div className={cs(styleObjkt.rarity)}>
                  Rarity: {objkt.rarity.toFixed(3)}
                </div>
              </>
            )}
          </div>

          <Spacing size="small" sm="x-small" />

          {objkt.issuer.redeemables.length > 0 && (
            <>
              <RedeemableIndicator
                objkt={objkt}
                showLabel
                enableHover={false}
              />
              <Spacing size="small" sm="x-small" />
            </>
          )}

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
            {objkt.issuer?.author && (
              <div className={cs(style.badge)}>
                <span className={cs(colors["gray-dark"])}>created by</span>
                <EntityBadge
                  className={styleObjkt.entity}
                  user={objkt.issuer.author}
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
