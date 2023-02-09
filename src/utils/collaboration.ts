import { CollaborationProposal } from "../services/indexing/contract-handlers/CollaborationHandler"
import { Collaboration } from "../types/entities/User"

/**
 * Check if a proposal can be executed
 */
export function canProposalBeExecuted(
  proposal: CollaborationProposal,
  collaboration: Collaboration
): boolean {
  if (proposal.executed) return false
  let approvals = 0
  for (const add in proposal.approvals) {
    if (proposal.approvals[add] === true) {
      approvals++
    }
  }
  return approvals === collaboration.collaborators.length
}
