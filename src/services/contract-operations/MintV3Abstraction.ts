import { GenerativeToken } from "./../../types/entities/GenerativeToken"
import { MintTicket } from "./../../types/entities/MintTicket"
import {
  ContractAbstraction,
  TransactionWalletOperation,
  Wallet,
} from "@taquito/taquito"
import { FxhashContracts } from "../../types/Contracts"
import { ContractOperation } from "./ContractOperation"
import { genTokCurrentPrice } from "utils/generative-token"

export type TMintV3AbstractionOperationParams = {
  // if a ticket ID is provided, uses the ticket; otherwise mints on issuer
  ticketId: number | null
  token: GenerativeToken
  inputBytes: string
}

/**
 * Provides a single entity to either:
 * - mint with a ticket, if provided
 * - mint directly on the issuer, with input bytes
 */
export class MintV3AbstractionOperation extends ContractOperation<TMintV3AbstractionOperationParams> {
  contract: ContractAbstraction<Wallet> | null = null
  useTicket: boolean | null = null

  async prepare() {
    this.useTicket = this.params.ticketId !== null
    this.contract = await this.manager.getContract(FxhashContracts.ISSUER_V3)
  }

  async call(): Promise<TransactionWalletOperation> {
    const ep = this.useTicket ? "mint_with_ticket" : "mint"
    const params = this.useTicket
      ? {
          issuer_id: this.params.token.id,
          ticket_id: this.params.ticketId,
          input_bytes: this.params.inputBytes,
          recipient: null,
        }
      : {
          issuer_id: this.params.token.id,
          referrer: null,
          reserve_input: null,
          create_ticket: null,
          recipient: null,
          input_bytes: this.params.inputBytes,
        }
    const options = this.useTicket
      ? {}
      : {
          amount: genTokCurrentPrice(this.params.token),
          mutez: true,
        }

    console.log(params, options)
    return this.contract!.methodsObject[ep](params).send(options)
  }

  success(): string {
    return this.useTicket
      ? `You have successfully exchanged one ticket for an iteration of "${this.params.token.name}".`
      : `You have successfully minted an iteration of "${this.params.token.name}".`
  }
}
