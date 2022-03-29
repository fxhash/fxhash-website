import { ContractAbstraction, TransactionWalletOperation, Wallet } from "@taquito/taquito"
import { FxhashContracts } from "../../types/Contracts"
import { GenerativeToken } from "../../types/entities/GenerativeToken"
import { Collaboration } from "../../types/entities/User"
import { ContractOperation } from "./ContractOperation"

export type TBurnTokenOperationParams = {
  collaboration?: Collaboration
  token: GenerativeToken
}

/**
 * Update the general settings of the an issuer
 * issuer > update_issuer
 */
export class BurnTokenOperation extends ContractOperation<TBurnTokenOperationParams> {
  contract: ContractAbstraction<Wallet>|null = null

  async prepare() {
    this.contract = await this.manager.getContract(
      this.params.collaboration?.id || FxhashContracts.ISSUER
    )
  }

  async call(): Promise<TransactionWalletOperation> {

    const params = this.params.token.id

    // if the author is a collab contract, we have to call the collab contract
    // proposal EP instead
    // if (this.params.collaboration) {
    //   const packed = packBurnToken(params)
    //   return this.contract!.methodsObject.make_proposal({
    //     call_id: FxhashCollabFactoryCalls.MINT_ISSUER,
    //     call_params: packed,
    //   }).send()
    // }
    // else { 
      return this.contract!.methodsObject.burn(params).send()
    // }
  }

  success(): string {
    return this.params.collaboration
     ? `A proposal to burn ${this.params.token.name} was successfully sent`
     : `You have burnt ${this.params.token.name}. [insert dramatic music]`
  }
}