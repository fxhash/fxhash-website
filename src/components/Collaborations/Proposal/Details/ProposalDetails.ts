import { FunctionComponent } from "react"
import { CollaborationProposal } from "../../../../services/indexing/contract-handlers/CollaborationHandler"
import { Collaboration } from "../../../../types/entities/User"
import { ProposalDetailsMintIssuerExpanded, ProposalDetailsMintIssuerHeader } from "./MintIssuer"
import { ProposalDetailsUpdateIssuerExpanded, ProposalDetailsUpdateIssuerHeader } from "./UpdateIssuer"

export interface ProposalDetailsProps {
  proposal: CollaborationProposal
  collaboration: Collaboration
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
  },
  1: {
    header: ProposalDetailsUpdateIssuerHeader,
    expanded: ProposalDetailsUpdateIssuerExpanded,
  }
}