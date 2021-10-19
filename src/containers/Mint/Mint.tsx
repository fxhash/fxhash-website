import style from "./Mint.module.scss"
import cs from "classnames"
import { GenerativeToken } from "../../types/entities/GenerativeToken"
import { useContext, useEffect } from "react"
import { UserContext } from "../UserProvider"
import { MintInformations } from "./Informations"
import { Spacing } from "../../components/Layout/Spacing"
import { useContractCall, useMint } from "../../utils/hookts"
import { MintError } from "../../types/Responses"
import { MintLoading } from "./Loading"
import { getMintError } from "../../utils/errors"
import { getMintProgressMessage } from "../../utils/messages"
import { MintCall } from "../../types/ContractCalls"
import { stringToByteString } from "../../utils/convert"
import { getIpfsSlash } from "../../utils/ipfs"
import { messageFromState } from "../../components/Feedback/ContractFeedback"
import { MintSuccess } from "./Success"


interface Props {
  token: GenerativeToken
}

export function Mint({ token }: Props) {
  const userCtx = useContext(UserContext)
  const user = userCtx.user!

  // mint hook to be called and get responses about progress from server
  const { progress, error: mtError, success: mtSuccess, loading: mtLoading, data, start } = useMint(token.id)

  // hook to interact with the contract
  const { state: callState, loading: contractLoading, success: contractSuccess, call: callContract, error: contractError } = 
    useContractCall<MintCall>(userCtx.walletManager!.mintToken)

  console.log({ progress, mtError, mtSuccess, mtLoading, data })

  // when API call succeeds, we can call the contract
  useEffect(() => {
    if (mtSuccess && data) {
      console.log("call contract")
      callContract({
        issuer_address: token.author.id,
        issuer_id: token.id,
        token_infos: stringToByteString(getIpfsSlash(data.cidMetadata)),
        price: token.price
      })
    }
  }, [mtSuccess, data])

  // loading is derived from mint progress & contract call
  const loading = mtLoading || contractLoading

  // same for error
  const error = mtError 
    ? getMintError(mtError)
    : (contractError ? "There was an error when injecting into the blockchain" : null)

  // same for loading message
  const loadMessage = (mtLoading && progress) 
    ? getMintProgressMessage(progress) 
    : (contractLoading && messageFromState(callState))

  // and success
  const success = contractSuccess

  return (
    <div className={cs(style.container)}>
      <Spacing size="3x-large"/>

      {success ? (
        <MintSuccess
          mintData={data!}
          user={user}
        />
      ):(
        loading ? (
          <MintLoading
            message={loadMessage || ""}
          />
        ):(
          <MintInformations 
            token={token}
            onStart={start}
            error={error}
          />
        )
      )}
    </div>
  )
}