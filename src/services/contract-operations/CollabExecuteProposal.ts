import { ContractAbstraction, TransactionWalletOperation, Wallet } from "@taquito/taquito"
import { Collaboration } from "../../types/entities/User"
import { CollaborationProposal } from "../indexing/contract-handlers/CollaborationHandler"
import { ContractOperation } from "./ContractOperation"

export type TCollabExecuteProposalParams = {
  collaboration: Collaboration
  proposal: CollaborationProposal
}

/**
 * Execute for a proposal
 */
export class CollabExecuteProposalOperation extends ContractOperation<TCollabExecuteProposalParams> {
  contract: ContractAbstraction<Wallet>|null = null

  async prepare() {
    this.contract = await this.manager.getContract(
      this.params.collaboration.id
    )
  }

  async call(): Promise<TransactionWalletOperation> {
    return this.contract!.methodsObject.execute_proposal(
      this.params.proposal.id,
    ).send()
  }

  success(): string {
    return `You have successfully executed the operation in the name of all the collaborators.`
  }
}