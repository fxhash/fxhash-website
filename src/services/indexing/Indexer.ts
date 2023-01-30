import { TzktOperation } from "../../types/Tzkt"
import { fetchRetry } from "../../utils/network"
import {
  API_BLOCKCHAIN_CONTRACT_DETAILS,
  API_BLOCKCHAIN_CONTRACT_OPERATIONS,
  API_BLOCKCHAIN_CONTRACT_STORAGE,
} from "../Blockchain"
import { ContractIndexingHandler } from "./contract-handlers/ContractHandler"

/**
 * A generic-purpose indexer designed to query Tzkt to process the operations
 * of a contract. It requires to be instanciated with a ContractHandler which
 * is an object implementing a set of keymethods called at certain moments
 * during the indexing cycle.
 */
export class Indexer<Result> {
  // the address of the contract to index
  address: string
  // used to process operations
  contractHandler: ContractIndexingHandler<Result>
  // the cursor keeps track of the last ID indexed
  cursor: number
  // the size of the batches requested on tzkt for each call
  batchSize: number
  // the result of the indexing, which must be mutated at each operation indexed
  result: Result
  // a function which, if defined, is called each time an operation is indexed
  update?: (data: Result) => void

  constructor(
    address: string,
    contractHandler: ContractIndexingHandler<Result>,
    batchSize: number = 100
  ) {
    this.address = address
    this.contractHandler = contractHandler
    this.batchSize = batchSize
    this.cursor = 0
    this.result = this.contractHandler.init()
  }

  /**
   * Fetches tzkt to get the storage of the contract and populate the results
   * accordingly with the handler storage update
   */
  async init() {
    if (this.contractHandler.indexStorage) {
      const response = await fetchRetry(
        API_BLOCKCHAIN_CONTRACT_STORAGE(this.address)
      )
      const data = await response.json()
      // the handler is resposible for updating the state
      this.result = await this.contractHandler.indexStorage(data, this.result)
      // eventually trigger an update
      this.update?.(this.result)
    }

    // if the handler specifies global function, we query general details
    if (this.contractHandler.indexDetails) {
      const response = await fetchRetry(
        API_BLOCKCHAIN_CONTRACT_DETAILS(this.address)
      )
      const data = await response.json()
      // the handler responsible for processing the details
      this.result = await this.contractHandler.indexDetails(data, this.result)
      // eventually trigger an update
      this.update?.(this.result)
    }
  }

  /**
   * Is called with a bunch of operations to process each one and update the
   * result accordingly
   */
  async indexOperations(operations: TzktOperation[]) {
    for (const op of operations) {
      await this.indexOperation(op)
    }
  }

  /**
   * Is called on a single operation to process it
   */
  async indexOperation(op: TzktOperation) {
    // call the handler corresponding to the EP and update the result
    const newResult = await this.contractHandler.handlers[
      op.parameter.entrypoint
    ](op, this.result)
    // update the cursor
    this.cursor = op.id
    // eventually trigger an update
    if (this.update && newResult !== this.result) {
      this.update(newResult)
    }
    // update the final result
    this.result = newResult
  }

  /**
   * Called to start the indexing process, will only resolve once all the
   * operations are indexed
   */
  index(): Promise<Result> {
    return new Promise(async (resolve, reject) => {
      // we index until we reach the end
      while (true) {
        // fetch tzkt to get the current batch of operations
        const response = await fetchRetry(
          API_BLOCKCHAIN_CONTRACT_OPERATIONS(
            this.address,
            this.cursor,
            Object.keys(this.contractHandler.handlers),
            this.batchSize
          )
        )
        const data = await response.json()

        // we put a stop there if needed
        if (!data || data.length === 0) break

        await this.indexOperations(data)

        // if the number of operations returned is less than the batch size, we
        // have reached the end
        if (data.length < this.batchSize) {
          break
        }
      }
      resolve(this.result)
    })
  }
}
