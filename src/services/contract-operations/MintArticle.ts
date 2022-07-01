import { ContractAbstraction, MichelsonMap, TransactionWalletOperation, Wallet } from "@taquito/taquito"
import { FxhashContracts } from "../../types/Contracts"
import { MintArticleData } from "../../types/MintArticle"
import { stringToByteString } from "../../utils/convert"
import { ContractOperation } from "./ContractOperation"

export type TMintArticleOperationParams = {
  data: MintArticleData<string>
}

/**
 * Mint an unique iteration of a Generative Token
 */
export class MintArticleOperation extends ContractOperation<TMintArticleOperationParams> {
  contract: ContractAbstraction<Wallet>|null = null

  async prepare() {
    this.contract = await this.manager.getContract(
      FxhashContracts.ARTICLES
    )
  }

  async call(): Promise<TransactionWalletOperation> {
    // build the metadata map
    const metadata = new MichelsonMap()
    metadata.set("", stringToByteString(`ipfs://${this.params.data.metadataCid}`))

    return this.contract!.methodsObject.mint({
      amount: this.params.data.distribution.editions,
      royalties: this.params.data.distribution.royalties,
      royalties_split: this.params.data.distribution.royalties_split,
      metadata: metadata
    }).send()
  }

  success(): string {
    return `Your article was successfully minted.`
  }
}