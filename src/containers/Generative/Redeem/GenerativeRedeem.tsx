import React, { memo } from "react"
import cs from "classnames"
import layout from "../../../styles/Layout.module.scss"
import Link from "next/link"
import { getGenerativeTokenUrl } from "../../../utils/generative-token"
import { Button } from "../../../components/Button"
import { Icon } from "../../../components/Icons/Icon"
import { Spacing } from "../../../components/Layout/Spacing"
import { RedeemableDetailsView } from "../../../components/Entities/RedeemableDetailsView"
import { RedeemableDetails } from "../../../types/entities/Redeemable"
import { GenerativeToken } from "../../../types/entities/GenerativeToken"
import style from "./GenerativeRedeem.module.scss"

interface GenerativeRedeemProps {
  token: GenerativeToken
  redeemableDetails: RedeemableDetails[]
}

const _GenerativeRedeem = ({
  token,
  redeemableDetails,
}: GenerativeRedeemProps) => {
  const renderBackToProject = (
    <div className={cs(layout.flex_column_left)}>
      <Link href={getGenerativeTokenUrl(token)}>
        <Button isLink iconComp={<Icon icon="arrow-left" />} size="small">
          back to project
        </Button>
      </Link>
    </div>
  )
  return (
    <div className={style.root}>
      {renderBackToProject}
      <Spacing size="x-large" />
      <div>
        {redeemableDetails.map((details) => (
          <RedeemableDetailsView
            key={details.address}
            details={details}
            title={token.name}
            info={
              <span>
                The iterations of this project can be redeemed to activate an
                event. Redeeming a token will not destroy it, and owners will
                keep the ownership of their token.
              </span>
            }
          />
        ))}
      </div>
      <Spacing size="x-large" />
      {renderBackToProject}
    </div>
  )
}

export const GenerativeRedeem = memo(_GenerativeRedeem)
