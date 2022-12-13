import style from "./RedeemGentk.module.scss"
import cs from "classnames"
import { Objkt } from "types/entities/Objkt"
import { RedeemableDetails } from "types/entities/Redeemable"
import { InlineTokenCard } from "components/Views/InlineTokenCard"
import { PageLayout } from "components/Layout/PageLayout"
import { getGentkUrl } from "utils/gentk"
import { Button } from "components/Button"
import { Icon } from "components/Icons/Icon"
import Link from "next/link"
import { Infobox } from "components/UI/Infobox"
import { Spacing } from "components/Layout/Spacing"
import { LinkGuide } from "components/Link/LinkGuide"
import { RedeemForm } from "./RedeemForm"

interface Props {
  gentk: Objkt
  redeemable: RedeemableDetails
}
export function RedeemGentk({ gentk, redeemable }: Props) {
  return (
    <PageLayout padding="small" columnCentered>
      <InlineTokenCard
        ipfsUri={gentk.metadata?.thumbnailUri}
        image={gentk.captureMedia}
        identifier="Redeem:"
        title={gentk.name!}
        author={gentk.issuer.author}
      >
        <Link href={getGentkUrl(gentk)}>
          <Button isLink size="small" iconComp={<Icon icon="arrow-left" />}>
            back to token page
          </Button>
        </Link>
      </InlineTokenCard>

      <Spacing size="2x-large" />

      <Infobox>
        This page lets you redeem your token to activate its effect.
        <br />
        <strong>You will keep the ownership of your token.</strong>
        <br />
        <LinkGuide href="/doc">Read more about redeemable tokens</LinkGuide>
      </Infobox>

      <Spacing size="2x-large" />

      <h4>Redeem for: {redeemable.name}</h4>

      <Spacing size="2x-large" />

      <RedeemForm redeemable={redeemable} gentk={gentk} />
    </PageLayout>
  )
}
