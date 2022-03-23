import { FunctionComponent } from "react"
import { CollaborationProposal } from "../../../../services/indexing/contract-handlers/CollaborationHandler"
import { ProposalDetailsMintIssuerExpanded, ProposalDetailsMintIssuerHeader } from "./MintIssuer"

export interface ProposalDetailsProps {
  proposal: CollaborationProposal
}

export interface IProposalDetails {
  header: FunctionComponent<ProposalDetailsProps>
  expanded: FunctionComponent<ProposalDetailsProps>
}

// maps proposal call IDs to their rendering components
export const ProposalDetails: Record<number, IProposalDetails> = {
  0: {
    header: ProposalDetailsMintIssuerHeader,
    expanded: ProposalDetailsMintIssuerExpanded,
  }
}