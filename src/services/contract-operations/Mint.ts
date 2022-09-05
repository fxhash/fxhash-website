import { ContractAbstraction, TransactionWalletOperation, Wallet } from "@taquito/taquito"
import { FxhashContracts } from "../../types/Contracts"
import { GenerativeToken } from "../../types/entities/GenerativeToken"
import { EReserveMethod } from "../../types/entities/Reserve"
import { packMintReserveInput } from "../../utils/pack/reserves"
import { ContractOperation } from "./ContractOperation"

export type TMintOperationParams = {
  token: GenerativeToken
  price: number
  consumeReserve: boolean
}

/**
 * Mint an unique iteration of a Generative Token
 */
export class MintOperation extends ContractOperation<TMintOperationParams> {
  issuerContract: ContractAbstraction<Wallet>|null = null

  async prepare() {
    this.issuerContract = await this.manager.getContract(FxhashContracts.ISSUER)
  }

  async call(): Promise<TransactionWalletOperation> {
    return this.issuerContract!.methodsObject.mint({
      issuer_id: this.params.token.id,
      referrer: null,
      // todo: abstract this logic, we don't want a single boolean as input now
      reserve_input: this.params.consumeReserve 
        ? packMintReserveInput({ method: EReserveMethod.WHITELIST, data: null })
        : null,
    }).send({
      amount: this.params.price,
      mutez: true,
      storageLimit: 650,
    })
  }

  success(): string {
    return `Minted your unique iteration of ${this.params.token.name}`
  }
}