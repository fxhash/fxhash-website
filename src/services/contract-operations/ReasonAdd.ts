import { ContractAbstraction, MichelsonMap, TransactionWalletOperation, Wallet } from "@taquito/taquito"
import { FxhashContracts } from "../../types/Contracts"
import { ISplit } from "../../types/entities/Split"
import { stringToByteString } from "../../utils/convert"
import { ContractOperation } from "./ContractOperation"

export type TResonAddParams = {
  reason: string
  contract: "user"|"token"
}

/**
 * Updates user profile
 */
export class ResonAddOperation extends ContractOperation<TResonAddParams> {
  contract: ContractAbstraction<Wallet>|null = null

  async prepare() {
    this.contract = await this.manager.getContract(
      this.params.contract === "token"
        ? FxhashContracts.MODERATION
        : FxhashContracts.USER_MODERATION
    )
  }

  async call(): Promise<TransactionWalletOperation> {
    return this.contract!.methodsObject.reason_add(
      this.params.reason
    ).send()
  }

  success(): string {
    return `You have successfully added a reason to the ${this.params.contract} moderation contract: ${this.params.reason}.`
  }
}