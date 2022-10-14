import { ContractAbstraction, MichelsonMap, TransactionWalletOperation, Wallet } from "@taquito/taquito"
import { NFTArticle } from "../../types/entities/Article"
import { FxhashContracts } from "../../types/Contracts"
import { stringToByteString } from "../../utils/convert"
import { ContractOperation } from "./ContractOperation"

export type TUpdateArticleOperationParams = {
  article: NFTArticle
  metadataCid: string
}

/**
 * Mint an unique iteration of a Generative Token
 */
export class UpdateArticleOperation extends ContractOperation<TUpdateArticleOperationParams> {
  contract: ContractAbstraction<Wallet>|null = null

  async prepare() {
    this.contract = await this.manager.getContract(
      FxhashContracts.ARTICLES
    )
  }

  async call(): Promise<TransactionWalletOperation> {
    // build the metadata map
    const metadata = new MichelsonMap()
    metadata.set("", stringToByteString(`ipfs://${this.params.metadataCid}`))

    return this.contract!.methodsObject.update_metadata({
      token_id: this.params.article.id,
      metadata: metadata
    }).send()
  }

  success(): string {
    return `Your article was successfully minted.`
  }
}