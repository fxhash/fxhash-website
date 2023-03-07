import {
  ContractAbstraction,
  TransactionWalletOperation,
  Wallet,
} from "@taquito/taquito"
import { NFTArticle } from "../../types/entities/Article"
import { FxhashContracts } from "../../types/Contracts"
import { ContractOperation } from "./ContractOperation"

export interface ITaxationSettings {
  coverage: number
  price: number
}

export type TTicketClaimV3OperationParams = {
  ticket: any
  amount: number
  taxationSettings: ITaxationSettings
}

/**
 * Mint an unique iteration of a Generative Token
 */
export class TicketClaimV3Operation extends ContractOperation<TTicketClaimV3OperationParams> {
  contract: ContractAbstraction<Wallet> | null = null

  async prepare() {
    this.contract = await this.manager.getContract(
      FxhashContracts.MINT_TICKETS_V3
    )
  }

  async call(): Promise<TransactionWalletOperation> {
    return this.contract!.methodsObject.claim({
      token_id: this.params.ticket.id,
      transfer_to: null,
      taxation: this.params.taxationSettings,
    }).send({
      amount: this.params.amount,
      mutez: true,
    })
  }

  success(): string {
    return `You have claimed the ticket ${this.params.ticket}, and its pricing settings have been updated.`
  }
}
