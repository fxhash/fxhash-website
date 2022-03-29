import { ContractAbstraction, TransactionWalletOperation, Wallet } from "@taquito/taquito"
import { FxhashContracts } from "../../types/Contracts"
import { GenerativeToken } from "../../types/entities/GenerativeToken"
import { Collaboration } from "../../types/entities/User"
import { ContractOperation } from "./ContractOperation"

export type TBurnSupplyOperationParams = {
  collaboration?: Collaboration
  token: GenerativeToken
  supply: number
}

/**
 * Update the general settings of the an issuer
 * issuer > update_issuer
 */
export class BurnSupplyOperation extends ContractOperation<TBurnSupplyOperationParams> {
  contract: ContractAbstraction<Wallet>|null = null

  async prepare() {
    this.contract = await this.manager.getContract(
      this.params.collaboration?.id || FxhashContracts.ISSUER
    )
  }

  async call(): Promise<TransactionWalletOperation> {

    const params = {
      issuer_id: this.params.token.id,
      amount: this.params.supply,
    }

    // if the author is a collab contract, we have to call the collab contract
    // proposal EP instead
    // if (this.params.collaboration) {
    //   const packed = packBurnSupply(params)
    //   return this.contract!.methodsObject.make_proposal({
    //     call_id: FxhashCollabFactoryCalls.MINT_ISSUER,
    //     call_params: packed,
    //   }).send()
    // }
    // else { 
      return this.contract!.methodsObject.burn_supply(params).send()
    // }
  }

  success(): string {
    return this.params.collaboration
     ? `A proposal to burn ${this.params.supply} editions of ${this.params.token.name} was successfully sent`
     : `You have burnt ${this.params.supply} editions of ${this.params.token.name}`
  }
}