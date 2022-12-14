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
import { useLazyQuery } from "@apollo/client"
import { Qu_genToken } from "../../../../queries/generative-token"
import { Spacing } from "../../../Layout/Spacing"
import { JsonViewer } from "../../../Utils/JsonViewer"
import { unpackUpdateIssuer } from "../../../../utils/unpack/update-issuer"
import { LoaderBlock } from "../../../Layout/LoaderBlock"
import { ListSplits } from "../../../List/ListSplits"
import { Qu_users } from "../../../../queries/user"
import { User } from "../../../../types/entities/User"
import { displayRoyalties } from "../../../../utils/units"
import { GenerativeToken } from "../../../../types/entities/GenerativeToken"
import { LinkIcon } from "../../../Link/LinkIcon"
import { getGenerativeTokenUrl } from "../../../../utils/generative-token"

export function ProposalDetailsUpdateIssuerHeader({
  proposal,
}: ProposalDetailsProps) {
  return <h5>Update Generative Token {"->"} General settings</h5>
}

export function ProposalDetailsUpdateIssuerExpanded({
  proposal,
  collaboration,
  showOldSettings,
}: ProposalDetailsProps) {
  const unpacked = useMemo(
    () => unpackUpdateIssuer(proposal.callSettings.params),
    [proposal]
  )

  // the qury to get the issuer associated with the call
  const [getToken, { data: tokenData, loading: tokenLoading }] =
    useLazyQuery(Qu_genToken)

  // the query to get the users in the splits
  const [getUsers, { data: usersData, loading: usersLoading }] =
    useLazyQuery(Qu_users)

  useEffect(() => {
    const userIds = unpacked.primary_split
      .map((splt) => splt.address)
      .concat(unpacked.royalties_split.map((splt) => splt.address))

    getToken({
      variables: {
        id: unpacked.issuer_id,
      },
    })
    getUsers({
      variables: {
        filters: {
          id_in: userIds,
        },
        skip: 0,
        take: 500,
      },
    })
  }, [unpacked])

  // we transformed the packed data into something that can be shown
  const splits = useMemo(() => {
    const ud: User[] = usersData?.users || []
    return {
      primary: unpacked.primary_split.map((split) => ({
        pct: split.pct,
        user: ud.find((u) => u.id === split.address) || {
          id: split.address,
        },
      })),
      secondary: unpacked.royalties_split.map((split) => ({
        pct: split.pct,
        user: ud.find((u) => u.id === split.address) || {
          id: split.address,
        },
      })),
    }
  }, [unpacked, usersData])

  // loading derived from both loading states
  const loading = tokenLoading || usersLoading
  // easier
  const token: GenerativeToken = tokenData?.generativeToken

  return (
    <div>
      {loading ? (
        <LoaderBlock height="20vh" size="small" />
      ) : (
        <>
          <h5>Preview</h5>
          <Spacing size="small" />

          {token && (
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
          )}

          <div className={cs(layout.cols2)}>
            <div>
              <h6>New settings</h6>
              <Spacing size="8px" />

              <div className={cs(style.details)}>
                <div>
                  <strong>Enabled: </strong>
                  <strong
                    className={cs(
                      unpacked.enabled ? colors.success : colors.error
                    )}
                  >
                    {unpacked.enabled ? "true" : "false"}
                  </strong>
                </div>
                <ListSplits
                  name="Primary split"
                  splits={splits.primary as any}
                  toggled
                />
                <div>
                  <strong>Royalties: </strong>
                  <span>{displayRoyalties(unpacked.royalties)}</span>
                </div>
                <ListSplits
                  name="Secondary split"
                  splits={splits.secondary as any}
                  toggled
                />
              </div>
            </div>

            {token && showOldSettings && (
              <div>
                <h6>Current settings</h6>
                <Spacing size="8px" />

                <div className={cs(style.details)}>
                  <div>
                    <strong>Enabled: </strong>
                    <strong
                      className={cs(
                        token.enabled ? colors.success : colors.error
                      )}
                    >
                      {token.enabled ? "true" : "false"}
                    </strong>
                  </div>
                  <ListSplits
                    name="Primary split"
                    splits={token.splitsPrimary}
                    toggled
                  />
                  <div>
                    <strong>Royalties: </strong>
                    <span>{displayRoyalties(token.royalties)}</span>
                  </div>
                  <ListSplits
                    name="Secondary split"
                    splits={token.splitsSecondary}
                    toggled
                  />
                </div>
              </div>
            )}
          </div>
        </>
      )}

      <Spacing size="large" />

      <h5>Call parameters</h5>
      <Spacing size="8px" />
      <JsonViewer json={unpacked as any} collapsed={true} />
    </div>
  )
}
