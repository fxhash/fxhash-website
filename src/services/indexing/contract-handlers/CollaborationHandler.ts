import { cloneDeep } from "@apollo/client/utilities"
import { getDiffByPath } from "../../../utils/indexing"
import { ContractIndexingHandler } from "./ContractHandler"

export type TApprovals = Record<string, boolean>

export interface CollaborationProposal {
  id: number
  createdAt: Date
  approvals: TApprovals
  callSettings: {
    id: number
    params: string
  }
  executed: boolean
  executedBy: string | null
  executedAt: Date | null
  initiator: string
}

export interface CollaborationContractState {
  balance?: number
  initiator: string | null
  shares: Record<string, number>
  proposals: Record<number, CollaborationProposal>
}

// bigmap types
type TProposalK = string
type TProposalV = {
  approvals: TApprovals
  call_settings: {
    call_id: string
    call_params: string
  }
  executed: boolean
  initiator: string
}

export const CollaborationContractHandler: ContractIndexingHandler<CollaborationContractState> =
  {
    init: () => {
      return {
        initiator: null,
        shares: {},
        proposals: {},
      }
    },

    indexStorage: async (storage, state) => {
      // we can just reset the state as indexStorage() is called before anything
      const res: CollaborationContractState = {
        initiator: storage.initiator,
        shares: {},
        proposals: {},
      }

      // process the shares
      for (const address in storage.shares) {
        res.shares[address] = parseInt(storage.shares[address])
      }

      return res
    },

    indexDetails: async (details, state) => {
      const nstate = { ...state }
      nstate.balance = details.balance
      return nstate
    },

    handlers: {
      // collaborators can make any proposal
      make_proposal: async (op, state) => {
        const proposalDiff = getDiffByPath<TProposalK, TProposalV>(
          op.diffs,
          "proposals"
        )
        if (!proposalDiff) return state

        // extract stuff
        const id = parseInt(proposalDiff.content.key)
        const values = proposalDiff.content.value

        // otherwise we apply the proposal to the state
        const updated = cloneDeep(state) as CollaborationContractState
        updated.proposals[id] = {
          id: id,
          createdAt: new Date(op.timestamp),
          approvals: values.approvals,
          callSettings: {
            id: parseInt(values.call_settings.call_id),
            params: values.call_settings.call_params,
          },
          executed: false,
          initiator: values.initiator,
          executedBy: null,
          executedAt: null,
        }

        return updated
      },

      // collaborators can vote on a proposal
      vote_proposal: async (op, state) => {
        const proposalDiff = getDiffByPath<TProposalK, TProposalV>(
          op.diffs,
          "proposals"
        )
        if (!proposalDiff) return state

        // extract stuff
        const id = parseInt(proposalDiff.content.key)
        const values = proposalDiff.content.value

        // otherwise we apply the proposal to the state
        const updated = cloneDeep(state) as CollaborationContractState
        updated.proposals[id].approvals = values.approvals
        return updated
      },

      // collaborators can execute a proposal
      execute_proposal: async (op, state) => {
        const proposalDiff = getDiffByPath<TProposalK, TProposalV>(
          op.diffs,
          "proposals"
        )
        if (!proposalDiff) return state

        // extract stuff
        const id = parseInt(proposalDiff.content.key)

        // otherwise we apply the proposal to the state
        const updated = cloneDeep(state) as CollaborationContractState
        updated.proposals[id].executed = true
        updated.proposals[id].executedBy = op.sender.address
        updated.proposals[id].executedAt = new Date(op.timestamp)
        return updated
      },
    },
  }
