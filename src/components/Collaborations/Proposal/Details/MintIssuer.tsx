import style from "./ProposalDetailsMintIssuerHeader.module.scss"
import cs from "classnames"
import { ProposalDetailsProps } from "./ProposalDetails"
import { EBuildableParams, unpackBytes } from "../../../../services/parameters-builder/BuildParameters"
import { transformMintIssuerBigNumbers } from "../../../../utils/unpack-transformers/mint-issuer"
import { TInputMintIssuer } from "../../../../services/parameters-builder/mint-issuer/input"
import { BigNumber } from "bignumber.js"
import { TInputPricingFixed } from "../../../../services/parameters-builder/pricing-fixed/input"
import { unpackMintIssuer } from "../../../../utils/unpack/mint-issuer"


export function ProposalDetailsMintIssuerHeader({
  proposal
}: ProposalDetailsProps) {
  return (
    <h5>Publish a Generative Token</h5>
  )
}

export function ProposalDetailsMintIssuerExpanded({
  proposal
}: ProposalDetailsProps) {
  const unpacked = unpackMintIssuer(proposal.callSettings.params)
  return (
    <div>expanded</div>
  )
}