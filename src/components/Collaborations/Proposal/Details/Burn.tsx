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
import { EBuildableParams, unpackBytes } from "../../../../services/parameters-builder/BuildParameters"


export function ProposalDetailsBurnHeader({
  proposal,
}: ProposalDetailsProps) {
  return (
    <h5>Burn Generative Token</h5>
  )
}

export function ProposalDetailsBurnExpanded({
  proposal,
  collaboration,
  showOldSettings,
}: ProposalDetailsProps) {
  const unpacked = useMemo(() =>
    unpackBytes(
      proposal.callSettings.params,
      EBuildableParams.BURN,
    ).toNumber()
  , [proposal])

  // the qury to get the issuer associated with the call
  const { data, loading } = useQuery(Qu_genToken, {
    variables: {
      id: unpacked
    }
  })

  // easier
  const token: GenerativeToken = data?.generativeToken


  return (
    <div>
      {loading ? (
        <LoaderBlock
          height="20vh"
          size="small"
        />
      ):(
        <>
          <h5>Preview</h5>
          <Spacing size="small"/>
          
          {token ? (
            <>
              <strong>Token: </strong>
              <LinkIcon
                iconComp={
                  <i aria-hidden className="fas fa-external-link-square"/>
                }
                href={getGenerativeTokenUrl(token)}
                newTab
              >
                {token.name}
              </LinkIcon>
              <Spacing size="regular"/>
              <strong className={cs(colors.error)}>
                This operation will burn the token completely. It will be removed from the contracts and from the indexer.
              </strong>
            </>
          ):(
            !showOldSettings && (
              <strong className={cs(colors.error)}>
                This token isn't visible anymore as it was burnt.
              </strong>
            )
          )}
        </>
      )}
    </div>
  )
}