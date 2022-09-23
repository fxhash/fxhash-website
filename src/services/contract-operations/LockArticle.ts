import {
  ContractAbstraction,
  TransactionWalletOperation,
  Wallet,
} from "@taquito/taquito"
import { NFTArticle } from "../../types/entities/Article"
import { FxhashContracts } from "../../types/Contracts"
import { ContractOperation } from "./ContractOperation"

export type TLockArticleOperationParams = {
  article: NFTArticle
}

/**
 * Mint an unique iteration of a Generative Token
 */
export class LockArticleOperation extends ContractOperation<TLockArticleOperationParams> {
  contract: ContractAbstraction<Wallet> | null = null

  async prepare() {
    this.contract = await this.manager.getContract(FxhashContracts.ARTICLES)
  }

  async call(): Promise<TransactionWalletOperation> {
    return this.contract!.methodsObject.lock_metadata(
      this.params.article.id
    ).send()
  }

  success(): string {
    return `Article meta_data was successfully locked.`
  }
}
