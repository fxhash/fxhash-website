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
import { Collaboration, UserType } from "../../types/entities/User"
import { UpdateIssuerForm } from "../../types/UpdateIssuer"
// import { packUpdateIssuer } from "../../utils/pack/mint-issuer"
import { transformUpdateIssuerFormToNumbers } from "../../utils/transformers/update-issuer"
import { EBuildableParams, pack } from "../parameters-builder/BuildParameters"
import { ContractOperation } from "./ContractOperation"

export type TUpdateIssuerV3OperationParams = {
  token: GenerativeToken
  data: UpdateIssuerForm<string>
}

/**
 * Update the general settings of the an issuer
 * issuer > update_issuer
 */
export class UpdateIssuerV3Operation extends ContractOperation<TUpdateIssuerV3OperationParams> {
  contract: ContractAbstraction<Wallet> | null = null
  collab: boolean = false

  async prepare() {
    this.collab = this.params.token.author.type === UserType.COLLAB_CONTRACT_V1
    this.contract = await this.manager.getContract(
      this.collab ? this.params.token.author.id : FxhashContracts.ISSUER_V3
    )
  }

  async call(): Promise<TransactionWalletOperation> {
    // transform the string values in the form into some numbers so that
    // it can be sent to contract correctly (or packed)
    const numbered = transformUpdateIssuerFormToNumbers(this.params.data)

    const params = {
      issuer_id: this.params.token.id - 26000,
      enabled: numbered.enabled,
      royalties: numbered.royalties,
      primary_split: numbered.splitsPrimary,
      royalties_split: numbered.splitsSecondary,
    }

    // if the author is a collab contract, we have to call the collab contract
    // proposal EP instead
    if (this.collab) {
      const packed = pack(params, EBuildableParams.UPDATE_ISSUER)

      return this.contract!.methodsObject.make_proposal({
        call_id: FxhashCollabFactoryCalls.UPDATE_ISSUER,
        call_params: packed,
      }).send()
    } else {
      return this.contract!.methodsObject.update_issuer(params).send()
    }
  }

  success(): string {
    return this.collab
      ? `A proposal to update "${this.params.token.name}" was successfully sent`
      : `Your project "${this.params.token.name}" was updated`
  }
}
