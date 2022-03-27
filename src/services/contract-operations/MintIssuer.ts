import { ContractAbstraction, TransactionWalletOperation, Wallet } from "@taquito/taquito"
import { FxhashContract } from "../../types/Contracts"
import { GenerativeToken } from "../../types/entities/GenerativeToken"
import { GenerativeTokenMetadata } from "../../types/Metadata"
import { MintGenerativeData } from "../../types/Mint"
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
  issuerContract: ContractAbstraction<Wallet>|null = null

  async prepare() {
    this.issuerContract = await this.manager.getContract(FxhashContract.ISSUER)
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

    console.log(this.issuerContract!.methodsObject.mint_issuer().getSignature())

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
      royalties: distribution.royalties,
      royalties_split: distribution.splitsSecondary,
      tags: informations.labels,
    }

    console.log(params)

    return this.issuerContract!.methodsObject.mint_issuer(params).send()
  }

  success(): string {
    return `Your project ${this.params.metadata.name} is successfully published`
  }
}