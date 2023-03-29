import {
  ContractAbstraction,
  MichelsonMap,
  TransactionWalletOperation,
  Wallet,
} from "@taquito/taquito"
import { FxhashContracts } from "../../types/Contracts"
import { ContractOperation } from "./ContractOperation"

export type TModContractKey = "user" | "token" | "token_v3" | "article"

export type TModerateParams = {
  contract: TModContractKey
  entityId: any
  state: number
  reason: number
}

export const mapModKtKeyToContract: Record<TModContractKey, string> = {
  user: FxhashContracts.USER_MODERATION,
  token: FxhashContracts.MODERATION,
  token_v3: FxhashContracts.MODERATION_V3,
  article: FxhashContracts.ARTICLE_MODERATION,
}

/**
 * Updates user profile
 */
export class ModerateOperation extends ContractOperation<TModerateParams> {
  contract: ContractAbstraction<Wallet> | null = null

  async prepare() {
    this.contract = await this.manager.getContract(
      mapModKtKeyToContract[this.params.contract]
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
    if (
      contract === "token" ||
      contract === "token_v3" ||
      contract === "article"
    ) {
      params.token_id = entityId
    } else {
      params.address = entityId
    }

    return this.contract!.methodsObject.moderate(params).send()
  }

  success(): string {
    return `You have successfully added a reason to the ${this.params.contract} moderation contract: ${this.params.reason}.`
  }
}
