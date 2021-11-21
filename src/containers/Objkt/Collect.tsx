import style from "./OfferControl.module.scss"
import { useContext, useState } from "react"
import { Button } from "../../components/Button"
import { InputTextUnit } from "../../components/Input/InputTextUnit"
import { Objkt } from "../../types/entities/Objkt"
import cs from "classnames"
import { useContractCall } from "../../utils/hookts"
import { UserContext } from "../UserProvider"
import { CancelOfferCall, CollectCall, PlaceOfferCall } from "../../types/ContractCalls"
import { ContractFeedback } from "../../components/Feedback/ContractFeedback"
import { Offer } from "../../types/entities/Offer"
import { displayMutez } from "../../utils/units"
import { useRouter } from "next/router"
import { GenTokFlag } from "../../types/entities/GenerativeToken"
import { Unlock } from "../../components/Utils/Unlock"

interface Props {
  offer: Offer
  objkt: Objkt
}

export function Collect({ offer, objkt }: Props) {
  const userCtx = useContext(UserContext)
  const router = useRouter()

  const [locked, setLocked] = useState<boolean>([GenTokFlag.AUTO_DETECT_COPY, GenTokFlag.REPORTED, GenTokFlag.MALICIOUS].includes(objkt.issuer.flag))

  const { state, loading: contractLoading, error: contractError, success, call, clear } = 
    useContractCall<CollectCall>(userCtx.walletManager?.collect)

  const callContract = () => {
    if (!userCtx.user) {
      router.push(`/sync-redirect?target=${encodeURIComponent(router.asPath)}`)
    }
    else {
      call({
        offerId: offer.id,
        price: offer.price
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
        successMessage="You have collected this token !"
      />

      <div className={cs(style.lock_container)}>
        <Button
          state={contractLoading ? "loading" : "default"}
          color="secondary"
          onClick={callContract}
          disabled={locked}
        >
          collect token - {displayMutez(offer.price)} tez
        </Button>
        {locked && (
          <Unlock
            locked={true}
            onClick={() => setLocked(false)}
          />
        )}
      </div>
    </>
  )
}