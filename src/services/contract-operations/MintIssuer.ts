import { ContractAbstraction, TransactionWalletOperation, Wallet } from "@taquito/taquito"
import { FxhashCollabFactoryCalls, FxhashContracts } from "../../types/Contracts"
import { GenerativeToken } from "../../types/entities/GenerativeToken"
import { GenerativeTokenMetadata } from "../../types/Metadata"
import { MintGenerativeData } from "../../types/Mint"
import { packMintIssuer } from "../../utils/pack/mint-issuer"
import { packPricing } from "../../utils/pack/pricing"
import { transformGenTokFormToNumbers } from "../../utils/transformers/gen-tok-input-form"
import { ContractOperation } from "./ContractOperation"

export type TMintIssuerOperationParams = {
  data: MintGenerativeData<string>
  metadata: GenerativeTokenMetadata
  metadataBytes: string
}

/**
 * Mint an unique iteration of a Generative Token
 * todo: setup the price stuff
 */
export class MintIssuerOperation extends ContractOperation<TMintIssuerOperationParams> {
  contract: ContractAbstraction<Wallet>|null = null

  async prepare() {
    this.contract = await this.manager.getContract(
      this.params.data.collaboration?.id || FxhashContracts.ISSUER
    )
  }

  async call(): Promise<TransactionWalletOperation> {

    // transform the string values in the form into some numbers so that
    // it can be sent to contract correctly (or packed)
    const numbered = transformGenTokFormToNumbers(this.params.data)

    console.log(this.params.data)
    console.log(numbered)

    // let's pack the pricing (only sub-field "details" gets packed)
    const packedPricing = packPricing(
      numbered.distribution!.pricing
    )
    console.log(packedPricing)

    const distribution = numbered.distribution!
    const informations = numbered.informations!

    const params = {
      amount: distribution.editions!,
      enabled: !!distribution.enabled,
      metadata: this.params.metadataBytes,
      pricing: packedPricing,
      primary_split: distribution.splitsPrimary,
      // todo
      reserves: [],
      royalties: distribution.royalties!,
      royalties_split: distribution.splitsSecondary,
      tags: informations.labels,
    }
    console.log(params)
    console.log(this.params.data.collaboration)

    // if the author is a collab contract, we have to call the collab contract
    // proposal EP instead
    if (this.params.data.collaboration) {
      const packed = packMintIssuer(params)
      console.log(packed)
      return this.contract!.methodsObject.make_proposal({
        call_id: FxhashCollabFactoryCalls.MINT_ISSUER,
        call_params: packed,
      }).send()
    }
    else { 
      return this.contract!.methodsObject.mint_issuer(params).send()
    }
  }

  success(): string {
    return this.params.data.collaboration
     ? `A request to publish ${this.params.metadata.name} was successfully sent`
     : `Your project ${this.params.metadata.name} is successfully published`
  }
}