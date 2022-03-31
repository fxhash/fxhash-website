import { useState } from "react"
import useAsyncEffect from "use-async-effect"
import { ContractIndexingHandler } from "../services/indexing/contract-handlers/ContractHandler"
import { Indexer } from "../services/indexing/Indexer"


export interface IIndexerHookReturn<Result> {
  loading: boolean
  data: Result|null
  error: boolean
}

/**
 * A generic-purpose hook providing an interface to interact with an
 * IndexingManager. Lightweight contracts can be indexed on the front easily
 * and it's done by an Indexer instance which queries operations on Tzkt and
 * call a handler to update a global object which is returned when no more
 * operations can be fetched on the contract.
 * @param contractAddress the tezos address of the contract to index
 * @param contractHandler the corresponding indexing manager to process
 * @param realtime if set to true, the data will be constently updated as the
 * indexer will run in the background. if set to false, the data will only be
 * set once the indexer has fully indexed the contract
 * the operations of the given contract
 */
export function useIndexer<Result>(
  contractAddress: string,
  contractHandler: ContractIndexingHandler<Result>,
  realtime: boolean = false,
): IIndexerHookReturn<Result> {
  // true until indexing is fully done
  const [loading, setLoading] = useState<boolean>(true)
  // will be populated with indexing data
  const [data, setData] = useState<Result|null>(null)
  // if there's any error, it's set there
  const [error, setError] = useState<boolean>(false)

  // bootstraps the indexing manager on the contract and processes operations
  useAsyncEffect(async (isMounted) => {
    // an utility function which can be used to update the state
    const updateData = (update: Result) => {
      if (isMounted()) {
        setData(update)
        setLoading(false)
      }
    }

    // instanciates an Indexer with the given contract handler
    const indexer = new Indexer(
      contractAddress,
      contractHandler,
      realtime ? updateData : undefined
    )
    
    try {
      // first initialized the indexer (fetches the storage if defined in handler)
      await indexer.init()
  
      // runs the indexing and eventually get some data
      const result = await indexer.index()

      // the state can be updated with the output data
      if (!realtime) {
        updateData(result)
      }
    }
    catch(err) {
      console.error(err)
      isMounted() && setError(true)
    }
  }, [])

  return {
    loading,
    data,
    error,
  }
}