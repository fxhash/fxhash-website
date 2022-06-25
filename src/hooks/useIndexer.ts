import { useRef, useState } from "react"
import useAsyncEffect from "use-async-effect"
import { ContractIndexingHandler } from "../services/indexing/contract-handlers/ContractHandler"
import { Indexer } from "../services/indexing/Indexer"


export interface IIndexerHookReturn<Result> {
  loading: boolean
  data: Result|null
  error: boolean
  reIndex: () => Promise<void>
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
  refreshInterval: number|false = false,
): IIndexerHookReturn<Result> {
  // true until indexing is fully done
  const [loading, setLoading] = useState<boolean>(true)
  // will be populated with indexing data
  const [data, setData] = useState<Result|null>(null)
  // if there's any error, it's set there
  const [error, setError] = useState<boolean>(false)
  // reference to the indexer instance
  const indexerRef = useRef<Indexer<Result>|null>(null)

  // a function to trigger manually the indexer
  const reIndex = async () => {
    if (indexerRef.current) {
      const nres = await indexerRef.current.index()
      if (nres !== data) {
        setData(nres)
      }
    }
  }

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
    )
    indexerRef.current = indexer

    // stores the indexing result, mostly in case of a periodic refresh
    let result: Result
    
    try {
      // first initialized the indexer (fetches the storage if defined in handler)
      await indexer.init()
  
      // runs the indexing and eventually get some data
      result = await indexer.index()

      // the state can be updated with the output data
      isMounted() && updateData(result)
    }
    catch(err) {
      console.error(err)
      isMounted() && setError(true)
    }

    // if an interval is set, we request an indexer refresh every now and then
    if (refreshInterval !== false) {
      const interval = setInterval(async () => {
        const nresult = await indexer.index()
        if (nresult !== result && isMounted()) {
          setData(nresult)
        }
        result = nresult
      }, refreshInterval)

      return () => {
        clearInterval(interval)
      }
    }
  }, [])

  return {
    loading,
    data,
    error,
    reIndex,
  }
}