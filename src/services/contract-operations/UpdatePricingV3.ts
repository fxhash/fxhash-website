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
import { UserType } from "../../types/entities/User"
import { GenTokPricingForm } from "../../types/Mint"
import { packPricing } from "../../utils/pack/pricing"
import { transformPricingFormToNumbers } from "../../utils/transformers/pricing"
import { EBuildableParams, pack } from "../parameters-builder/BuildParameters"
import { ContractOperation } from "./ContractOperation"

export type TUpdatePricingV3OperationParams = {
  data: GenTokPricingForm<string>
  token: GenerativeToken
}

/**
 * Updates the pricing of a Generative Token
 */
export class UpdatePricingV3Operation extends ContractOperation<TUpdatePricingV3OperationParams> {
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
    const numbered = transformPricingFormToNumbers(this.params.data)

    // let's pack the pricing (only sub-field "details" gets packed)
    const packedPricing = packPricing(numbered)

    const params = {
      issuer_id: this.params.token.id,
      pricing: packedPricing,
    }

    // if the author is a collab contract, we have to call the collab contract
    // proposal EP instead
    if (this.collab) {
      const packed = pack(params, EBuildableParams.UPDATE_PRICE_V3)
      return this.contract!.methodsObject.make_proposal({
        call_id: FxhashCollabFactoryCalls.UPDATE_PRICE_V3,
        call_params: packed,
      }).send()
    } else {
      return this.contract!.methodsObject.update_price(params).send()
    }
  }

  success(): string {
    return this.collab
      ? `A request to update the pricing of "${this.params.token.name}" was successfully sent`
      : `The pricing of "${this.params.token.name}" was successfully updated`
  }
}
