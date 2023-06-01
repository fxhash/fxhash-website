import { OpKind, WalletOperation, WalletParamsWithKind } from "@taquito/taquito"
import { FxhashContracts } from "../../types/Contracts"
import { Objkt } from "../../types/entities/Objkt"
import {
  buildParameters,
  EBuildableParams,
} from "../parameters-builder/BuildParameters"
import { ContractOperation } from "./ContractOperation"
import { ListingCancelOperation } from "./ListingCancel"
import { getGentkLocalIDFromObjkt } from "../../utils/entities/gentk"

export type TTransferGentkOperationParams = {
  objkt: Objkt // with active listing
  fromTzAddress: string
  toTzAddress: string
  toUsername?: string
}

/**
 * Transfer a gentk
 */
export class TransferGentkOperation extends ContractOperation<TTransferGentkOperationParams> {
  static generateOp(
    objkt: Objkt,
    fromTzAddress: string,
    toTzAddress: string
  ): WalletParamsWithKind {
    return {
      kind: OpKind.TRANSACTION,
      to: FxhashContracts.GENTK_V3,
      amount: 0,
      parameter: {
        entrypoint: "transfer",
        value: buildParameters(
          [
            {
              from_: fromTzAddress,
              txs: [
                {
                  to_: toTzAddress,
                  token_id: getGentkLocalIDFromObjkt(objkt),
                  amount: 1,
                },
              ],
            },
          ],
          EBuildableParams.TRANSFER
        ),
      },
      storageLimit: 100,
    }
  }

  async prepare() {}

  async call(): Promise<WalletOperation> {
    // the list of operations
    const operations: WalletParamsWithKind[] = []
    const { objkt, toTzAddress, fromTzAddress } = this.params

    // if there's an active listing, it must first be cancelled
    if (objkt.activeListing) {
      operations.push(ListingCancelOperation.generateOp(objkt.activeListing))
    }

    // transfer
    operations.push(
      TransferGentkOperation.generateOp(objkt, fromTzAddress, toTzAddress)
    )

    return this.manager.tezosToolkit.wallet.batch().with(operations).send()
  }

  success(): string {
    const { objkt, toTzAddress, toUsername } = this.params
    return `You have transfered the gentk "${objkt.name}" to ${
      toUsername || toTzAddress
    }.`
  }
}
