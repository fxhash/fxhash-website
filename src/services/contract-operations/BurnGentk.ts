import { WalletOperation, WalletParamsWithKind } from "@taquito/taquito"
import { Objkt } from "../../types/entities/Objkt"
import { ContractOperation } from "./ContractOperation"
import { ListingCancelOperation } from "./ListingCancel"
import { TransferGentkOperation } from "./TransferGentk"

export type TBurnGentkOperationParams = {
  objkt: Objkt // with active listing
  fromTzAddress: string
}

/**
 * Burn a gentk
 */
export class BurnGentkOperation extends ContractOperation<TBurnGentkOperationParams> {
  burnAddress = "tz1burnburnburnburnburnburnburjAYjjX"
  async prepare() {}

  async call(): Promise<WalletOperation> {
    // the list of operations
    const operations: WalletParamsWithKind[] = []
    const { objkt, fromTzAddress } = this.params

    // if there's an active listing, it must first be cancelled
    if (objkt.activeListing) {
      operations.push(ListingCancelOperation.generateOp(objkt.activeListing))
    }

    // transfer
    operations.push(
      TransferGentkOperation.generateOp(objkt, fromTzAddress, this.burnAddress)
    )

    return this.manager.tezosToolkit.wallet.batch().with(operations).send()
  }

  success(): string {
    const { objkt } = this.params
    return `You have burn your gentk "${objkt.name}" [insert dramatic sound effect]`
  }
}
