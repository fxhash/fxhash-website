import { GenerativeToken } from "../../types/entities/GenerativeToken"
import {
  ContractAbstraction,
  OpKind,
  TransactionWalletOperation,
  Wallet,
  WalletOperation,
  WalletParamsWithKind,
} from "@taquito/taquito"
import { FxhashContracts } from "../../types/Contracts"
import { ContractOperation } from "./ContractOperation"
import { genTokCurrentPrice } from "utils/generative-token"
import { isTicketOwner, isTicketUsed } from "services/Blockchain"
import {
  buildParameters,
  EBuildableParams,
} from "../parameters-builder/BuildParameters"
import { MintTicket } from "../../types/entities/MintTicket"
import { getMintTicketHarbergerTax } from "../../utils/math"
import { getMintTicketDAPrice } from "../../utils/mint-ticket"
import { coverage } from "browserslist"

const isValidTicket = async (
  pkh: string,
  ticketId: number
): Promise<[isUsed: boolean, isOwned: boolean]> => {
  return Promise.all([isTicketUsed(ticketId), isTicketOwner(ticketId, pkh)])
}

const getFirstTicketAvailable = async (
  pkh: string,
  tickets: MintTicket[],
  claimTicket?: boolean
): Promise<[ticketId: MintTicket | null, claimTicket?: boolean]> => {
  for (const ticket of tickets) {
    const [isUsed, isOwner] = await isValidTicket(pkh, ticket.id)
    if (!isUsed && (claimTicket || isOwner)) {
      return [ticket, !isOwner]
    }
  }
  return [null]
}

export type TMintV3AbstractionOperationParams = {
  // if a ticket or array of ticket is provided, uses the first ticket available; otherwise mints on issuer
  ticket: MintTicket | MintTicket[] | null
  claimTicket?: boolean
  token: GenerativeToken
  inputBytes: string
}

/**
 * Provides a single entity to either:
 * - mint with a ticket, if provided
 * - claim the ticket first if claimTicket = true
 * - mint directly on the issuer, with input bytes
 */
export class MintV3AbstractionOperation extends ContractOperation<TMintV3AbstractionOperationParams> {
  contract: ContractAbstraction<Wallet> | null = null
  useTicket: boolean | null = null
  claimTicket?: boolean = false
  ticket: MintTicket | null = null

  async prepare() {
    this.useTicket = this.params.ticket !== null
    this.contract = await this.manager.getContract(FxhashContracts.ISSUER_V3)
  }

  async validateMultipleTickets(tickets: MintTicket[]): Promise<boolean> {
    const pkh = await this.manager.getBeaconWallet().getPKH()
    const [availableTicket, mustClaimTicket] = await getFirstTicketAvailable(
      pkh,
      tickets,
      this.params.claimTicket
    )
    if (availableTicket) {
      this.ticket = availableTicket
      if (mustClaimTicket) {
        this.claimTicket = true
      }
      return true
    }
    throw new Error("No tickets remaining.")
  }

  async validateSingleTicket(ticket: MintTicket): Promise<boolean> {
    const pkh = await this.manager.getBeaconWallet().getPKH()
    const [isUsed, isOwner] = await isValidTicket(pkh, ticket.id)
    if (isUsed) throw new Error("Ticket is already used.")
    if (!isOwner) {
      if (this.params.claimTicket) {
        this.claimTicket = true
      } else {
        throw new Error("Ticket is not owned by you.")
      }
    }
    this.ticket = ticket
    return true
  }

  async validate(): Promise<boolean> {
    if (this.useTicket) {
      if (this.params.ticket instanceof Array) {
        return this.validateMultipleTickets(this.params.ticket)
      } else {
        return this.validateSingleTicket(this.params.ticket!)
      }
    }
    return true
  }

  async call(): Promise<TransactionWalletOperation | WalletOperation> {
    await this.validate()
    if (this.useTicket) {
      const mintWithTicketParams = {
        issuer_id: this.params.token.id,
        ticket_id: this.ticket!.id,
        input_bytes: this.params.inputBytes,
        recipient: null,
      }
      if (this.claimTicket) {
        const ops: WalletParamsWithKind[] = []
        const ticketPrice = getMintTicketDAPrice(
          new Date(),
          new Date(this.ticket!.taxationPaidUntil),
          this.ticket!.price
        )
        const amount = ticketPrice + getMintTicketHarbergerTax(ticketPrice, 1)
        const val = buildParameters(
          {
            token_id: this.ticket!.id,
            transfer_to: null,
            taxation: {
              price: ticketPrice,
              coverage: 1,
            },
          },
          EBuildableParams.CLAIM_TICKET
        )
        ops.push({
          kind: OpKind.TRANSACTION,
          to: FxhashContracts.MINT_TICKETS_V3,
          amount,
          mutez: true,
          parameter: {
            entrypoint: "claim",
            value: val,
          },
          storageLimit: 300,
        })
        ops.push({
          kind: OpKind.TRANSACTION,
          to: FxhashContracts.ISSUER_V3,
          amount: 0,
          parameter: {
            entrypoint: "mint_with_ticket",
            value: buildParameters(
              mintWithTicketParams,
              EBuildableParams.MINT_WITH_TICKET
            ),
          },
          storageLimit: 650,
        })
        return this.manager.tezosToolkit.wallet.batch().with(ops).send()
      }
      return this.contract!.methodsObject["mint_with_ticket"](
        mintWithTicketParams
      ).send({})
    } else {
      return this.contract!.methodsObject["mint"]({
        issuer_id: this.params.token.id,
        referrer: null,
        reserve_input: null,
        create_ticket: null,
        recipient: null,
        input_bytes: this.params.inputBytes,
      }).send({
        amount: genTokCurrentPrice(this.params.token),
        mutez: true,
      })
    }
  }

  success(): string {
    return this.useTicket
      ? `You have successfully ${
          this.claimTicket ? "claimed" : "exchanged"
        } one ticket for an iteration of "${this.params.token.name}".`
      : `You have successfully minted an iteration of "${this.params.token.name}".`
  }
}
