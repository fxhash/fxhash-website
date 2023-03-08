import { FunctionComponent } from "react"
import { CollaborationProposal } from "../../../../services/indexing/contract-handlers/CollaborationHandler"
import { Collaboration } from "../../../../types/entities/User"
import { ProposalDetailsBurnExpanded, ProposalDetailsBurnHeader } from "./Burn"
import {
  ProposalDetailsBurnSupplyExpanded,
  ProposalDetailsBurnSupplyHeader,
} from "./BurnSupply"
import {
  ProposalDetailsMintIssuerExpanded,
  ProposalDetailsMintIssuerHeader,
} from "./MintIssuer"
import {
  ProposalDetailsMintIssuerV3Expanded,
  ProposalDetailsMintIssuerV3Header,
} from "./MintIssuerV3"
import {
  ProposalDetailsUpdateIssuerExpanded,
  ProposalDetailsUpdateIssuerHeader,
} from "./UpdateIssuer"
import {
  ProposalDetailsUpdatePriceExpanded,
  ProposalDetailsUpdatePriceHeader,
} from "./UpdatePrice"
import {
  ProposalDetailsUpdateReserveExpanded,
  ProposalDetailsUpdateReserveHeader,
} from "./UpdateReserve"

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
  // PRE_V3
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
  3: {
    header: ProposalDetailsUpdateReserveHeader,
    expanded: ProposalDetailsUpdateReserveExpanded,
  },
  4: {
    header: ProposalDetailsBurnSupplyHeader,
    expanded: ProposalDetailsBurnSupplyExpanded,
  },
  5: {
    header: ProposalDetailsBurnHeader,
    expanded: ProposalDetailsBurnExpanded,
  },
  // V3
  6: {
    header: ProposalDetailsMintIssuerV3Header,
    expanded: ProposalDetailsMintIssuerV3Expanded,
  },
  7: {
    header: ProposalDetailsUpdateIssuerHeader,
    expanded: ProposalDetailsUpdateIssuerExpanded,
  },
}
