import style from "./MintIssuer.module.scss"
import cs from "classnames"
import { ProposalDetailsProps } from "./ProposalDetails"
import { unpackMintIssuer } from "../../../../utils/unpack/mint-issuer"
import { useMemo, useState } from "react"
import { JsonViewer } from "../../../Utils/JsonViewer"
import useAsyncEffect from "use-async-effect"
import { fetchRetry } from "../../../../utils/network"
import { hexStringToString } from "../../../../utils/convert"
import { ipfsGatewayUrl } from "../../../../services/Ipfs"
import { GenerativeToken } from "../../../../types/entities/GenerativeToken"
import { generativeFromMintParams } from "../../../../utils/generative-token"
import { GenerativeDisplay } from "../../../../containers/Generative/Display/GenerativeDisplay"
import { Spacing } from "../../../Layout/Spacing"
import { LoaderBlock } from "../../../Layout/LoaderBlock"

export function ProposalDetailsMintIssuerHeader({
  proposal
}: ProposalDetailsProps) {
  return (
    <h5>Publish a Generative Token</h5>
  )
}

export function ProposalDetailsMintIssuerExpanded({
  proposal,
  collaboration,
}: ProposalDetailsProps) {
  // a fake generative token for visualization
  const [token, setToken] = useState<GenerativeToken>()

  // unpacks the call settings
  const unpacked = useMemo(() =>
    unpackMintIssuer(proposal.callSettings.params)
  , [proposal])

  // fetches the metadata and creates a fake Generative Token from it
  useAsyncEffect(async (isMounted) => {
    // we get the JSON object on IPFS
    const uri = hexStringToString(unpacked.metadata)
    const response = await fetchRetry(ipfsGatewayUrl(uri, "ipfsio"))
    const metadata = await response.json()
    // we generate a generative token from the details + metadata
    const generative = generativeFromMintParams(
      unpacked,
      metadata,
      uri,
      collaboration,
      collaboration.collaborators,
    )
    if (isMounted()) {
      setToken(generative)
    }
  }, [proposal])

  return (
    token ? (
      <div>
        <h5>Project preview (generated from call parameters)</h5>
        <Spacing size="3x-large"/>
        <div className={cs(style.project)}>
          <GenerativeDisplay
            token={token}
          />
        </div>

        <Spacing size="3x-large"/>

        <h5>Details</h5>
        <Spacing size="regular"/>
        <div className={cs(style.json)}>
          <JsonViewer
            json={token as any}
            collapsed={true}
          />
        </div>
      </div>
    ):(
      <LoaderBlock
        size="small"
        height="20vh"
      />
    )
  )
}