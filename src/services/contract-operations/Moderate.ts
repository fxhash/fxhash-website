import { ContractAbstraction, MichelsonMap, TransactionWalletOperation, Wallet } from "@taquito/taquito"
import { FxhashContracts } from "../../types/Contracts"
import { ContractOperation } from "./ContractOperation"

export type TModerateParams = {
  contract: "user"|"token"
  entityId: any
  state: number
  reason: number
}

/**
 * Updates user profile
 */
export class ModerateOperation extends ContractOperation<TModerateParams> {
  contract: ContractAbstraction<Wallet>|null = null

  async prepare() {
    this.contract = await this.manager.getContract(
      this.params.contract === "token"
        ? FxhashContracts.MODERATION
        : FxhashContracts.USER_MODERATION
    )
  }

  async call(): Promise<TransactionWalletOperation> {
    // extract
    const { contract, entityId, state, reason } = this.params

    // build the generic parameters
    const params: any = {
      reason: reason === -1 ? null : reason,
      state: state,
    }

    // now build contextual parameters based on target contract
    if (contract === "token") {
      params.token_id = entityId
    }
    else {
      params.address = entityId
    }

    return this.contract!.methodsObject.moderate(params).send()
  }

  success(): string {
    return `You have successfully added a reason to the ${this.params.contract} moderation contract: ${this.params.reason}.`
  }
}