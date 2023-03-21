import style from "./UpdateIssuer.module.scss"
import colors from "../../../../styles/Colors.module.css"
import layout from "../../../../styles/Layout.module.scss"
import cs from "classnames"
import { ProposalDetailsProps } from "./ProposalDetails"
import { useEffect, useMemo } from "react"
import { useLazyQuery, useQuery } from "@apollo/client"
import { Qu_genToken } from "../../../../queries/generative-token"
import { Spacing } from "../../../Layout/Spacing"
import { JsonViewer } from "../../../Utils/JsonViewer"
import { LoaderBlock } from "../../../Layout/LoaderBlock"
import { GenerativeToken } from "../../../../types/entities/GenerativeToken"
import { LinkIcon } from "../../../Link/LinkIcon"
import { getGenerativeTokenUrl } from "../../../../utils/generative-token"
import { unpackBurnSupply } from "../../../../utils/unpack/burn-supply"

export function ProposalDetailsBurnSupplyHeader({
  proposal,
}: ProposalDetailsProps) {
  return <h5>Update Generative Token {"->"} Burn editions</h5>
}

export function ProposalDetailsBurnSupplyExpanded({
  proposal,
  collaboration,
  showOldSettings,
}: ProposalDetailsProps) {
  const unpacked = useMemo(
    () => unpackBurnSupply(proposal.callSettings.params),
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
              <div className={cs(style.details)}>
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
                <strong>Burn amount: </strong>
                {unpacked.amount}
                {showOldSettings && (
                  <>
                    <strong>Balance: </strong>
                    <div>
                      {token.balance}
                      {" -> "}
                      {token.balance - unpacked.amount}
                    </div>
                  </>
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
