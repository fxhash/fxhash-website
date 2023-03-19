import {
  ContractAbstraction,
  MichelsonMap,
  TransactionWalletOperation,
  Wallet,
} from "@taquito/taquito"
import { ContractOperation } from "./ContractOperation"
import { mapModKtKeyToContract, TModContractKey } from "./Moderate"

export type TResonAddParams = {
  reason: string
  contract: TModContractKey
}

/**
 * Updates user profile
 */
export class ResonAddOperation extends ContractOperation<TResonAddParams> {
  contract: ContractAbstraction<Wallet> | null = null

  async prepare() {
    this.contract = await this.manager.getContract(
      mapModKtKeyToContract[this.params.contract]
    )
  }

  async call(): Promise<TransactionWalletOperation> {
    return this.contract!.methodsObject.reason_add(this.params.reason).send()
  }

  success(): string {
    return `You have successfully added a reason to the ${this.params.contract} moderation contract: ${this.params.reason}.`
  }
}
