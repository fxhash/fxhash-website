import style from "./OfferControl.module.scss"
import { useContext, useState } from "react"
import { Button } from "../../components/Button"
import { InputTextUnit } from "../../components/Input/InputTextUnit"
import { Objkt } from "../../types/entities/Objkt"
import cs from "classnames"
import { useContractCall } from "../../utils/hookts"
import { UserContext } from "../UserProvider"
import { PlaceOfferCall } from "../../types/ContractCalls"
import { ContractFeedback } from "../../components/Feedback/ContractFeedback"

interface Props {
  objkt: Objkt
}

export function PlaceOffer({ objkt }: Props) {
  const userCtx = useContext(UserContext)
  const user = userCtx.user!
  
  const [opened, setOpened] = useState<boolean>(false)
  const [price, setPrice] = useState<string>("")

  const { state, loading: contractLoading, error: contractError, success, call, clear } = 
    useContractCall<PlaceOfferCall>(userCtx.walletManager!.placeOffer)

  const callContract = () => {
    const mutez = Math.floor(parseFloat(price) * 1000000)
    if (isNaN(mutez)) {
      alert("Invalid price")
    }
    else {
      call({
        ownerAddress: objkt.owner!.id,
        tokenId: objkt.id,
        price: mutez,
        creatorAddress: objkt.issuer.author.id,
        royalties: objkt.royalties
      })
    }
  }

  return (
    <>
      <ContractFeedback
        state={state}
        loading={contractLoading}
        success={success}
        error={contractError}
        successMessage="Your Gentk has been listed"
      />

      {opened ? (
        <div className={cs(style.inputs)}>
          <InputTextUnit
            unit="tez"
            type="number"
            sizeX="small"
            value={price}
            onChange={evt => setPrice(evt.target.value)}
            min={0}
            step={0.0000001}
          />
          <Button
            state={contractLoading ? "loading" : "default"}
            color="secondary"
            size="small"
            onClick={callContract}
          >
            list for trade
          </Button>
        </div>
      ):(
        <Button
          color={opened ? "primary" : "secondary"}
          onClick={() => setOpened(!opened)}
        >
          place an offer
        </Button>
      )}
    </>
  )
}