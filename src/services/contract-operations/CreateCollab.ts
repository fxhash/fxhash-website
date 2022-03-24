import { ContractAbstraction, MichelsonMap, TransactionWalletOperation, Wallet } from "@taquito/taquito"
import { FxhashContract } from "../../types/Contracts"
import { ISplit } from "../../types/entities/Split"
import { stringToByteString } from "../../utils/convert"
import { ContractOperation } from "./ContractOperation"

export type TCreateCollabParams = {
  splits: ISplit[]
}

/**
 * Updates user profile
 */
export class CreateCollabOperation extends ContractOperation<TCreateCollabParams> {
  collabContract: ContractAbstraction<Wallet>|null = null

  async prepare() {
    this.collabContract = await this.manager.getContract(
      FxhashContract.COLLAB_FACTORY
    )
  }

  async call(): Promise<TransactionWalletOperation> {
    const shares = new MichelsonMap()
    for (const split of this.params.splits) {
      shares.set(split.address, split.pct)
    }
    return this.collabContract!.methodsObject.create_collab_contract({
      collaborators: this.params.splits.map(split => split.address),
      shares: shares,
    }).send()
  }

  success(): string {
    return `You have successfully originated your collaboration contract.`
  }
}