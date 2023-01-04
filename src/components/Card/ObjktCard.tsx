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
import { getObjktUrl } from "../../utils/objkt"
import { GenTokFlag } from "../../types/entities/GenerativeToken"
import React, { useContext, useMemo } from "react"
import { SettingsContext } from "../../context/Theme"
import { DisplayTezos } from "../Display/DisplayTezos"
import { EntityBadge } from "../User/EntityBadge"
import { format } from "date-fns"

interface Props {
  objkt: Objkt
  showOwner?: boolean
  showRarity?: boolean
  sold?: {
    date: Date
    price: number
  }
}

export function ObjktCard({
  objkt,
  sold,
  showOwner = true,
  showRarity = false,
}: Props) {
  const url = getObjktUrl(objkt)
  const settings = useContext(SettingsContext)
  const soldDate = useMemo(() => sold?.date && new Date(sold.date), [sold])
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
            {soldDate && (
              <div className={style.sold}>
                <span>Sold </span>
                <time dateTime={format(soldDate, "yyyy/MM/dd")}>
                  {format(soldDate, "d MMM yyyy @ HH:mm")}
                </time>
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

          <div className={cs(style.bottom)}>
            <div className={cs(style.bottom_left)}>
              <div className={cs(style.price)}>
                {objkt.activeListing && !sold && (
                  <DisplayTezos
                    mutez={objkt.activeListing.price!}
                    formatBig={false}
                  />
                )}
                {sold && <DisplayTezos mutez={sold.price} formatBig={false} />}
              </div>
            </div>
            {objkt.issuer && (
              <div className={cs(style.badge)}>
                <span className={cs(colors["gray-dark"])}>created by</span>
                <EntityBadge
                  className={styleObjkt.entity}
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
