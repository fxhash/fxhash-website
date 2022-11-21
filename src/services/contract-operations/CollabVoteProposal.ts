import { ContractAbstraction, TransactionWalletOperation, Wallet } from "@taquito/taquito"
import { Collaboration } from "../../types/entities/User"
import { CollaborationProposal } from "../indexing/contract-handlers/CollaborationHandler"
import { ContractOperation } from "./ContractOperation"

export type TCollabVoteProposalParams = {
  collaboration: Collaboration
  proposal: CollaborationProposal
  approval: boolean
}

/**
 * Vote for a proposal
 */
export class CollabVoteProposalOperation extends ContractOperation<TCollabVoteProposalParams> {
  contract: ContractAbstraction<Wallet>|null = null

  async prepare() {
    this.contract = await this.manager.getContract(
      this.params.collaboration.id
    )
  }

  async call(): Promise<TransactionWalletOperation> {
    return this.contract!.methodsObject.vote_proposal({
      proposal_id: this.params.proposal.id,
      approval: this.params.approval,
    }).send()
  }

  success(): string {
    return `You have ${this.params.approval ? "approved" : "rejected"} the proposal for the execution of an operation in your collaboration.`
  }
}