import {
  ContractAbstraction,
  TransactionWalletOperation,
  Wallet,
} from "@taquito/taquito"
import {
  FxhashCollabFactoryCalls,
  FxhashContracts,
} from "../../types/Contracts"
import { GenerativeToken } from "../../types/entities/GenerativeToken"
import { EBuildableParams, pack } from "../parameters-builder/BuildParameters"
import { ContractOperation } from "./ContractOperation"

export type TUpdateTokenModOperationParams = {
  token: GenerativeToken
  tags: number[]
}

/**
 * Update the general settings of the an issuer
 * issuer > update_issuer
 */
export class UpdateTokenModOperation extends ContractOperation<TUpdateTokenModOperationParams> {
  contract: ContractAbstraction<Wallet> | null = null

  async prepare() {
    this.contract = await this.manager.getContract(FxhashContracts.ISSUER)
  }

  async call(): Promise<TransactionWalletOperation> {
    return this.contract!.methodsObject.update_token_mod({
      issuer_id: this.params.token.id,
      tags: this.params.tags,
    }).send()
  }

  success(): string {
    return `You have updated the labels of the project "${this.params.token.name}"`
  }
}
