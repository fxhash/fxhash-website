import { FunctionComponent } from "react"
import { CollaborationProposal } from "../../../../services/indexing/contract-handlers/CollaborationHandler"
import { Collaboration } from "../../../../types/entities/User"
import { ProposalDetailsMintIssuerExpanded, ProposalDetailsMintIssuerHeader } from "./MintIssuer"
import { ProposalDetailsUpdateIssuerExpanded, ProposalDetailsUpdateIssuerHeader } from "./UpdateIssuer"
import { ProposalDetailsUpdatePriceExpanded, ProposalDetailsUpdatePriceHeader } from "./UpdatePrice"

export interface ProposalDetailsProps {
  proposal: CollaborationProposal
  collaboration: Collaboration
  showOldSettings?: boolean
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
  },
  2: {
    header: ProposalDetailsUpdatePriceHeader,
    expanded: ProposalDetailsUpdatePriceExpanded,
  },
}