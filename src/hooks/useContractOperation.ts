import type { WalletOperation } from "@taquito/taquito"
import { useContext, useRef, useState } from "react"
import { UserContext } from "../containers/UserProvider"
import { MessageCenterContext } from "../context/MessageCenter"
import { TContractOperation } from "../services/contract-operations/ContractOperation"
import { ContractOperationCallback, ContractOperationStatus, TContractOperationHookReturn } from "../types/Contracts"
import { useIsMounted } from "../utils/hookts"

/**
 * A
 */
export function useContractOperation<Params>(
  OperationClass: TContractOperation<Params>,
): TContractOperationHookReturn<Params> {
  const [state, setState] = useState<ContractOperationStatus>(
    ContractOperationStatus.NONE
  )
  const [loading, setLoading] = useState<boolean>(false)
  const [success, setSuccess] = useState<boolean>(false)
  const [error, setError] = useState<boolean>(false)
  const [opHash, setOpHash] = useState<string|null>(null)
  const [operation, setOperation] = useState<WalletOperation|null>(null)
  const [params, setParams] = useState<Params|null>(null)
  const counter = useRef<number>(0)
  const isMounted = useIsMounted()
  const userContext = useContext(UserContext)
  const messageCenter = useContext(MessageCenterContext)

  // resets the state
  const clear = () => {
    setLoading(false)
    setSuccess(false)
    setError(false)
    setOpHash(null)
    setOperation(null)
    setParams(null)
    setState(ContractOperationStatus.NONE)
  }

  // trigger the operation with the given parameters
  const call = async (params: Params) => {
    setLoading(true)
    setSuccess(false)
    setError(false)
    setOpHash(null)
    setOperation(null)
    setParams(params)
    setState(ContractOperationStatus.NONE)
    
    // assign the ID to this call and increment it to prevent overlaps
    counter.current++
    const id = counter.current

    // will be called to propagate the call progress
    const statusCallback: ContractOperationCallback = (status, data) => {
      if (counter.current === id && isMounted()) {
        setState(status)
        // if operation is *INJECTED*, we sent success
        if (status === ContractOperationStatus.INJECTED) {
          setSuccess(true)
          setLoading(false)
          // todo: type this shit
          if (data?.hash) {
            setOpHash(data.hash)
          }
          if (data?.operation) {
            setOperation(data.operation)
          }
        }
        else if (status === ContractOperationStatus.ERROR) {
          setLoading(false)
          setError(true)
        }
      }

      // even if not mounted anymore we push the messages to message center
      if (status === ContractOperationStatus.INJECTED) {
        console.log("op injected !")
        messageCenter.addMessages([
          {
            type: "warning",
            title: "Indexer delay",
            content: "We've added a 2 minutes delay to our indexer to protect against blockchain rollbacks occuring since last protocol update. It will take about 2 minutes for your operation to be visible on the website."
          },
          {
            type: "success",
            title: `Operation applied`,
            content: `${data.message}`
          }
        ])
      }
      else if (status === ContractOperationStatus.ERROR) {
        messageCenter.addMessage({
          type: "error",
          title: "Error when calling contract",
          content: data,
        })
      }
    }

    // if there's no user synced, we request a sync
    if (!userContext.user || !userContext.walletManager) {
      try {
        await userContext.connect()
      }
      catch (err) {
        statusCallback(
          ContractOperationStatus.ERROR, 
          "Wallet needs to be synced to run operations"
        )
        return
      }
    }

    // otherwise we can just trigger the operation
    userContext.walletManager?.runContractOperation(
      OperationClass,
      params,
      statusCallback
    )
  }

  return {
    state,
    params,
    opHash,
    operation,
    loading,
    success,
    call,
    clear,
    error
  }
}