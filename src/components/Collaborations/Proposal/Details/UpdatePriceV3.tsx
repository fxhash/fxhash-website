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
import {
  unpackUpdatePrice,
  unpackUpdatePriceV3,
} from "../../../../utils/unpack/update-price"
import {
  transformPricingDutchAuctionBigNumbers,
  transformPricingFixedBigNumbers,
} from "../../../../utils/unpack-transformers/pricings"
import { GenerativePricing } from "../../../GenerativeToken/GenerativePricing"

export function ProposalDetailsUpdatePriceV3Header({
  proposal,
}: ProposalDetailsProps) {
  return <h5>Update Generative Token {"->"} Update price</h5>
}

export function ProposalDetailsUpdatePriceV3Expanded({
  proposal,
  collaboration,
  showOldSettings,
}: ProposalDetailsProps) {
  const unpacked = useMemo(
    () => unpackUpdatePriceV3(proposal.callSettings.params),
    [proposal]
  )

  // the qury to get the issuer associated with the call
  const { data, loading } = useQuery(Qu_genToken, {
    variables: {
      id: unpacked.issuer_id,
    },
  })

  // easier
  const token: GenerativeToken = data?.generativeToken

  const priceDetails = useMemo(() => {
    if (!unpacked) return null
    if (unpacked.pricing.pricing_id === 0) {
      return transformPricingFixedBigNumbers(
        unpackBytes(unpacked.pricing.details, EBuildableParams.PRICING_FIXED)
      )
    } else {
      return transformPricingDutchAuctionBigNumbers(
        unpackBytes(
          unpacked.pricing.details,
          EBuildableParams.PRICING_DUTCH_AUCTION
        )
      )
    }
  }, [token])

  // build a fake token from the price details so that we can leverage the
  // generic display component
  const fakeNewToken = useMemo(() => {
    if (!priceDetails) return null
    const tok: Partial<GenerativeToken> = {}
    if (unpacked.pricing.pricing_id === 0) {
      tok.pricingFixed = {
        price: priceDetails.price,
        opensAt: priceDetails.opens_at,
      }
    } else {
      tok.pricingDutchAuction = {
        levels: priceDetails.levels,
        opensAt: priceDetails.opens_at,
        decrementDuration: priceDetails.decrement_duration,
      }
    }
    return tok
  }, [priceDetails])

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
                    <GenerativePricing
                      token={fakeNewToken as GenerativeToken}
                    />
                  </div>
                </div>

                {showOldSettings && (
                  <div>
                    <h6>Current settings</h6>
                    <Spacing size="8px" />

                    <div className={cs(style.details)}>
                      <GenerativePricing token={token} />
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
