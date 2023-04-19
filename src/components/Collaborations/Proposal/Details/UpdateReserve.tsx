import style from "./UpdateIssuer.module.scss"
import colors from "../../../../styles/Colors.module.css"
import layout from "../../../../styles/Layout.module.scss"
import cs from "classnames"
import { ProposalDetailsProps } from "./ProposalDetails"
import { useEffect, useMemo } from "react"
import {
  EBuildableParams,
  unpackBytes,
} from "../../../../services/parameters-builder/BuildParameters"
import { useLazyQuery, useQuery } from "@apollo/client"
import { Qu_genToken } from "../../../../queries/generative-token"
import { Spacing } from "../../../Layout/Spacing"
import { JsonViewer } from "../../../Utils/JsonViewer"
import { LoaderBlock } from "../../../Layout/LoaderBlock"
import { GenerativeToken } from "../../../../types/entities/GenerativeToken"
import { LinkIcon } from "../../../Link/LinkIcon"
import { getGenerativeTokenUrl } from "../../../../utils/generative-token"
import { unpackUpdateReserve } from "../../../../utils/unpack/update-reserve"
import {
  transformPricingDutchAuctionBigNumbers,
  transformPricingFixedBigNumbers,
} from "../../../../utils/unpack-transformers/pricings"
import { GenerativePricing } from "../../../GenerativeToken/GenerativePricing"
import { ListReserves } from "../../../List/ListReserves"

export function ProposalDetailsUpdateReserveHeader({
  proposal,
}: ProposalDetailsProps) {
  return <h5>Update Generative Token {"->"} Update reserves</h5>
}

export function ProposalDetailsUpdateReserveExpanded({
  proposal,
  collaboration,
  showOldSettings,
}: ProposalDetailsProps) {
  const unpacked = useMemo(
    () => unpackUpdateReserve(proposal.callSettings.params),
    [proposal]
  )

  // the query to get the issuer associated with the call
  const { data, loading } = useQuery(Qu_genToken, {
    variables: {
      id: unpacked.issuer_id,
    },
  })

  // easier
  const token: GenerativeToken = data?.generativeToken

  return (
    <div>
      {loading ? (
        <LoaderBlock height="20vh" size="small" />
      ) : (
        <>
          <h5>Preview</h5>
          <Spacing size="small" />

          {token && (
            <>
              <div>
                <strong>Token: </strong>
                <LinkIcon
                  iconComp={
                    <i aria-hidden className="fas fa-external-link-square" />
                  }
                  href={getGenerativeTokenUrl(token)}
                  newTab
                >
                  {token.name}
                </LinkIcon>
                <Spacing size="regular" />
              </div>

              <div className={cs(layout.cols2)}>
                <div>
                  <h6>New settings</h6>
                  <Spacing size="8px" />

                  <div className={cs(style.details)}>
                    <ListReserves reserves={unpacked.reserves} toggled />
                  </div>
                </div>

                {showOldSettings && (
                  <div>
                    <h6>Current settings</h6>
                    <Spacing size="8px" />

                    <div className={cs(style.details)}>
                      <ListReserves reserves={token.reserves} toggled />
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </>
      )}

      <Spacing size="large" />

      <h5>Call parameters</h5>
      <Spacing size="8px" />
      <JsonViewer json={unpacked as any} collapsed={true} />
    </div>
  )
}
