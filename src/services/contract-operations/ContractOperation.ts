import { TransactionWalletOperation, WalletOperation } from "@taquito/taquito";
import { BatchWalletOperation } from "@taquito/taquito/dist/types/wallet/batch-operation";
import { WalletManager } from "../Wallet";

/**
 * A Contract Operation defines a set of operations to run at different 
 * moments of the lifecycle of an operation. When an operation needs to be sent,
 * its corresponding class is instanciated with the operation parameters and
 * the following steps are performed:
 * - prepare: preparation steps before calling a contract
 * - call: the actual contract call
 * - success: a message is emitted
 * In case of failure, the whole lifecycle restarts, if the RPC is at cause it
 * is swapped with another one. This logic is handled by an external runner.
 */
export abstract class ContractOperation<Params> {
  // the WalletManager "global" instance, passed at instanciation
  manager: WalletManager
  // the call parameters associated with the Contract Operation
  params: Params

  constructor(manager: WalletManager, params: Params) {
    this.manager = manager
    this.params = params
  }
  
  /**
   * Runs the required preparations (such as fetching the contracts to get
   * the entrypoints signature), or any other sync/async operation considered
   * not to be a part of the actual contract call.
   * Can store required values in the members of the instance.
   */
  abstract prepare(): Promise<void>
  
  /**
   * The actual calls to the contracts, which results in some Transaction
   * Wallet Operation and can be observed to track the success/failure of
   * the transaction emitted
   */
  abstract call(): Promise<WalletOperation>

  /**
   * Each Contract Operation should implement a success message based on the
   * operation parameters, and so to provide meaningful feedback to users on
   * different parts of the front.
   * todo: define appropriate type
   */
  abstract success(): string
}

// a generic type for ContractOperation polymorphism
export type TContractOperation<Params> = 
  new (manager: WalletManager, params: Params) => ContractOperation<Params>