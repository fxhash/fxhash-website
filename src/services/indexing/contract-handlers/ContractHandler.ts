import { TzktOperation } from "../../../types/Tzkt"

export type ContractOperationHandler<Result> = (
  op: TzktOperation,
  current: Readonly<Result>,
) => Promise<Result>

export interface ContractIndexingHandler<Result> {
  // should return an empty data
  init: () => Result
  // allies the storage to the current data, if not defined is ignored
  indexStorage?: (storage: any, current: Readonly<Result>) => Promise<Result>
  // gets the contract's details, if not defined gets ignored
  indexDetails?: (details: any, current: Readonly<Result>) => Promise<Result>
  // handles individual operations and updates the result
  handlers: Record<string, ContractOperationHandler<Result>>
}