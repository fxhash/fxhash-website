import cs from "classnames"
import { Objkt } from "types/entities/Objkt"
import { RedeemableDetails } from "types/entities/Redeemable"
import { getGentkUrl } from "utils/gentk"
import { Button } from "components/Button"
import { Icon } from "components/Icons/Icon"
import Link from "next/link"
import { Spacing } from "components/Layout/Spacing"
import { RedeemForm } from "./RedeemForm"
import layout from "../../styles/Layout.module.scss"
import React from "react"
import style from "./RedeemGentk.module.scss"
import { ArtworkPreview } from "../../components/Artwork/Preview"
import { UserBadge } from "../../components/User/UserBadge"
import { CarouselRedeemable } from "../../components/Redeemable/CarouselRedeemable"

interface Props {
  gentk: Objkt
  redeemable: RedeemableDetails
}
export function RedeemGentk({ gentk, redeemable }: Props) {
  return (
    <>
      <div className={cs(layout.flex_column_left)}>
        <Link href={getGentkUrl(gentk)}>
          <Button isLink size="small" iconComp={<Icon icon="arrow-left" />}>
            back to token page
          </Button>
        </Link>
      </div>
      <Spacing size="x-large" />
      <div className={style.titles}>
        <div>
          <UserBadge user={gentk.issuer.author} size="big" />
          <Spacing size="x-large" sm="regular" />
          <h3>{gentk.name}</h3>
        </div>
        <div className={layout.hide_sm}>
          <h4>Redeem for: {redeemable.name}</h4>
        </div>
      </div>
      <Spacing size="2x-large" sm="x-large" />
      <div className={style.content}>
        <div className={style.content_left}>
          <ArtworkPreview
            image={gentk.captureMedia}
            ipfsUri={gentk.metadata?.thumbnailUri}
          />
        </div>
        <div>
          <div className={layout.show_sm}>
            <h4>Redeem for: {redeemable.name}</h4>
            <Spacing size="x-large" />
          </div>
          <CarouselRedeemable medias={redeemable.medias} />
          <Spacing size="x-large" />
          <RedeemForm redeemable={redeemable} gentk={gentk} />
        </div>
      </div>
    </>
  )
}
