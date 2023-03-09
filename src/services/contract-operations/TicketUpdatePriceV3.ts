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

export type TTicketUpdatePriceV3OperationParams = {
  ticketId: number
  amount: number
  taxationSettings: ITaxationSettings
}

/**
 * Mint an unique iteration of a Generative Token
 */
export class TicketUpdatePriceV3Operation extends ContractOperation<TTicketUpdatePriceV3OperationParams> {
  contract: ContractAbstraction<Wallet> | null = null

  async prepare() {
    this.contract = await this.manager.getContract(
      FxhashContracts.MINT_TICKETS_V3
    )
  }

  async call(): Promise<TransactionWalletOperation> {
    return this.contract!.methodsObject.update_price({
      token_id: this.params.ticketId,
      taxation: this.params.taxationSettings,
    }).send({
      amount: this.params.amount,
      mutez: true,
    })
  }

  success(): string {
    return `You have successfully updated the ticket pricing settings.`
  }
}
