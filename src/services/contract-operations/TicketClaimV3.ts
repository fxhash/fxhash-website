import { MintTicket } from "./../../types/entities/MintTicket"
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
  ticketId: number
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
    console.log({
      token_id: this.params.ticketId,
      transfer_to: null,
      taxation: this.params.taxationSettings,
      amount: this.params.amount,
    })
    return this.contract!.methodsObject.claim({
      token_id: this.params.ticketId,
      transfer_to: null,
      taxation: this.params.taxationSettings,
    }).send({
      amount: Math.floor(this.params.amount),
      mutez: true,
    })
  }

  success(): string {
    return `You have claimed the ticket and its pricing settings have been updated.`
  }
}
