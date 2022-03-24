import { ContractAbstraction, TransactionWalletOperation, Wallet } from "@taquito/taquito"
import { FxhashContract } from "../../types/Contracts"
import { stringToByteString } from "../../utils/convert"
import { ContractOperation } from "./ContractOperation"

export type TUpdateProfileParams = {
  metadata: string
  name: string
}

/**
 * Updates user profile
 */
export class UpdateProfileOperation extends ContractOperation<TUpdateProfileParams> {
  userRegister: ContractAbstraction<Wallet>|null = null

  async prepare() {
    this.userRegister = await this.manager.getContract(FxhashContract.REGISTER)
  }

  async call(): Promise<TransactionWalletOperation> {
    return this.userRegister!.methodsObject.update_profile({
      metadata: stringToByteString(this.params.metadata),
      name: stringToByteString(this.params.name)
    }).send()
  }

  success(): string {
    return `Your profile was updated ${this.params.name}`
  }
}