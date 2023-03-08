import {
  ContractAbstraction,
  TransactionWalletOperation,
  Wallet,
} from "@taquito/taquito"
import { stringToByteString } from "utils/convert"
import { getIpfsSlash } from "utils/ipfs"
import {
  FxhashCollabFactoryCalls,
  FxhashContracts,
} from "../../types/Contracts"
import { GenerativeTokenMetadata } from "../../types/Metadata"
import { MintGenerativeData } from "../../types/Mint"
import { mapReserveDefinition } from "../../utils/generative-token"
import { packMintIssuer } from "../../utils/pack/mint-issuer"
import { packPricing } from "../../utils/pack/pricing"
import { packReserveData } from "../../utils/pack/reserves"
import { transformGenTokFormToNumbers } from "../../utils/transformers/gen-tok-input-form"
import { ContractOperation } from "./ContractOperation"

export type TMintIssuerV3OperationParams = {
  data: MintGenerativeData<string>
  metadata: GenerativeTokenMetadata
  metadataBytes: string
  // todo: have some better data for ticket settings ?
  ticketMetadataBytes: string
}

/**
 * Mint an unique iteration of a Generative Token
 */
export class MintIssuerV3Operation extends ContractOperation<TMintIssuerV3OperationParams> {
  contract: ContractAbstraction<Wallet> | null = null

  async prepare() {
    this.contract = await this.manager.getContract(
      this.params.data.collaboration?.id || FxhashContracts.ISSUER_V3
    )
  }

  async call(): Promise<TransactionWalletOperation> {
    // transform the string values in the form into some numbers so that
    // it can be sent to contract correctly (or packed)
    const numbered = transformGenTokFormToNumbers(this.params.data)

    // let's pack the pricing (only sub-field "details" gets packed)
    const packedPricing = packPricing(numbered.distribution!.pricing)

    const distribution = numbered.distribution!
    const informations = numbered.informations!

    // let's build the reserves array
    const reserves = distribution.reserves.map((reserve) => ({
      amount: reserve.amount,
      method_id: mapReserveDefinition[reserve.method].id,
      data: packReserveData(reserve),
    }))

    const params = {
      amount: distribution.editions!,
      enabled: !!distribution.enabled,
      metadata: this.params.metadataBytes,
      pricing: packedPricing,
      primary_split: distribution.splitsPrimary,
      reserves: reserves,
      royalties: distribution.royalties!,
      royalties_split: distribution.splitsSecondary,
      tags: informations.labels,
      mint_ticket_settings:
        this.params.data.params!.inputBytesSize > 0
          ? {
              gracing_period: this.params.data.distribution?.gracingPeriod || 7,
              metadata: this.params.ticketMetadataBytes,
            }
          : null,
      open_editions: null,
      codex: {
        codex_entry: {
          type: 0,
          value: stringToByteString(
            getIpfsSlash(this.params.data.cidUrlParams!)
          ),
        },
      },
      input_bytes_size: this.params.data.params!.inputBytesSize,
    }

    // if the author is a collab contract, we have to call the collab contract
    // proposal EP instead
    if (this.params.data.collaboration) {
      const packed = packMintIssuer(params)
      return this.contract!.methodsObject.make_proposal({
        call_id: FxhashCollabFactoryCalls.MINT_ISSUER,
        call_params: packed,
      }).send()
    } else {
      return this.contract!.methodsObject.mint_issuer(params).send()
    }
  }

  success(): string {
    return this.params.data.collaboration
      ? `A request to publish ${this.params.metadata.name} was successfully sent`
      : `Your project ${this.params.metadata.name} is successfully published`
  }
}
