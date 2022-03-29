import { ContractAbstraction, TransactionWalletOperation, Wallet } from "@taquito/taquito"
import { FxhashContracts } from "../../types/Contracts"
import { GenerativeToken } from "../../types/entities/GenerativeToken"
import { Collaboration } from "../../types/entities/User"
import { UpdateIssuerForm } from "../../types/UpdateIssuer"
// import { packUpdateIssuer } from "../../utils/pack/mint-issuer"
import { transformUpdateIssuerFormToNumbers } from "../../utils/transformers/update-issuer"
import { ContractOperation } from "./ContractOperation"

export type TUpdateIssuerOperationParams = {
  collaboration?: Collaboration
  token: GenerativeToken
  data: UpdateIssuerForm<string>
}

/**
 * Update the general settings of the an issuer
 * issuer > update_issuer
 */
export class UpdateIssuerOperation extends ContractOperation<TUpdateIssuerOperationParams> {
  contract: ContractAbstraction<Wallet>|null = null

  async prepare() {
    this.contract = await this.manager.getContract(
      this.params.collaboration?.id || FxhashContracts.ISSUER
    )
  }

  async call(): Promise<TransactionWalletOperation> {

    // transform the string values in the form into some numbers so that
    // it can be sent to contract correctly (or packed)
    const numbered = transformUpdateIssuerFormToNumbers(this.params.data)

    const params = {
      issuer_id: this.params.token.id,
      enabled: numbered.enabled,
      royalties: numbered.royalties,
      primary_split: numbered.splitsPrimary,
      royalties_split: numbered.splitsSecondary,
    }

    console.log(params)

    // if the author is a collab contract, we have to call the collab contract
    // proposal EP instead
    // if (this.params.collaboration) {
    //   const packed = packUpdateIssuer(params)
    //   return this.contract!.methodsObject.make_proposal({
    //     call_id: FxhashCollabFactoryCalls.MINT_ISSUER,
    //     call_params: packed,
    //   }).send()
    // }
    // else { 
      return this.contract!.methodsObject.update_issuer(params).send()
    // }
  }

  success(): string {
    return this.params.collaboration
     ? `A proposal to update ${this.params.token.name} was successfully sent`
     : `Your project ${this.params.token.name} was updated`
  }
}