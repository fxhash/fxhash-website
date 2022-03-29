import { ContractAbstraction, TransactionWalletOperation, Wallet } from "@taquito/taquito"
import { FxhashCollabFactoryCalls, FxhashContracts } from "../../types/Contracts"
import { GenerativeToken } from "../../types/entities/GenerativeToken"
import { Collaboration } from "../../types/entities/User"
import { GenerativeTokenMetadata } from "../../types/Metadata"
import { GenTokPricingForm, MintGenerativeData } from "../../types/Mint"
import { packMintIssuer } from "../../utils/pack/mint-issuer"
import { packPricing } from "../../utils/pack/pricing"
import { transformGenTokFormToNumbers } from "../../utils/transformers/gen-tok-input-form"
import { transformPricingFormToNumbers } from "../../utils/transformers/pricing"
import { ContractOperation } from "./ContractOperation"

export type TUpdatePricingOperationParams = {
  data: GenTokPricingForm<string>
  token: GenerativeToken
  collaboration?: Collaboration
}

/**
 * Updates the pricing of a Generative Token
 */
export class UpdatePricingOperation extends ContractOperation<TUpdatePricingOperationParams> {
  contract: ContractAbstraction<Wallet>|null = null

  async prepare() {
    this.contract = await this.manager.getContract(
      this.params.collaboration?.id || FxhashContracts.ISSUER
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
      details: packedPricing.details,
    }

    // if the author is a collab contract, we have to call the collab contract
    // proposal EP instead
    // if (this.params.data.collaboration) {
    //   const packed = packMintIssuer(params)
    //   return this.contract!.methodsObject.make_proposal({
    //     call_id: FxhashCollabFactoryCalls.MINT_ISSUER,
    //     call_params: packed,
    //   }).send()
    // }
    // else { 
      return this.contract!.methodsObject.update_price(params).send()
    // }
  }

  success(): string {
    return this.params.collaboration
     ? `A request to update the pricing of ${this.params.token.name} was successfully sent`
     : `The pricing of ${this.params.token.name} was successfully updated`
  }
}