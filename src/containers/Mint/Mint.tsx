import style from "./Mint.module.scss"
import colors from "../../styles/Colors.module.css"
import cs from "classnames"
import { GenerativeToken } from "../../types/entities/GenerativeToken"
import { useContext, useEffect } from "react"
import Link from "next/link"
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
import { ContractFeedback, messageFromState } from "../../components/Feedback/ContractFeedback"
import { MintSuccess } from "./Success"
import { Button } from "../../components/Button"
import { displayMutez } from "../../utils/units"
import { useRouter } from "next/router"
import { getUserName } from "../../utils/user"


interface Props {
  token: GenerativeToken
}

export function Mint({ token }: Props) {
  const userCtx = useContext(UserContext)
  const router = useRouter()

  // hook to interact with the contract
  const { state, loading, success, call, error, transactionHash } = 
    useContractCall<MintCall>(userCtx.walletManager!.mintToken)

  const mint = () => {
    call({
      issuer_address: token.author.id,
      issuer_id: token.id,
      price: token.price
    })
  }

  useEffect(() => {
    if (transactionHash) {
      router.push(`/reveal/${transactionHash}`)
    }
  }, [transactionHash])

  return (
    <div className={cs(style.container)}>
      <Spacing size="6x-large"/>

      <p>
        You are about to mint your own unique token of the piece "<strong>{token.name}</strong>", 
        created by <strong className={cs(colors.secondary)}>{getUserName(token.author)}</strong>
      </p>

      <Spacing size="3x-large"/>

      <ContractFeedback
        state={state}
        error={error}
        success={success}
        loading={loading}
      />

      <Button 
        color="secondary"
        onClick={mint}
        state={loading ? "loading" : "default"}
      >
        Mint token — {displayMutez(token.price)} tez
      </Button>
    </div>
  )
}