import style from "./MarketplaceActions.module.scss"
import { useContext, useState } from "react"
import { Button } from "../../components/Button"
import { Objkt } from "../../types/entities/Objkt"
import cs from "classnames"
import { UserContext } from "../UserProvider"
import { ContractFeedback } from "../../components/Feedback/ContractFeedback"
import { Listing } from "../../types/entities/Listing"
import { useRouter } from "next/router"
import { GenTokFlag } from "../../types/entities/GenerativeToken"
import { Unlock } from "../../components/Utils/Unlock"
import { useContractOperation } from "../../hooks/useContractOperation"
import { ListingAcceptOperation, TListingAcceptOperationParams } from "../../services/contract-operations/ListingAccept"
import { DisplayTezos } from "../../components/Display/DisplayTezos"

interface Props {
  listing: Listing
  objkt: Objkt
}

export function ListingAccept({ listing, objkt }: Props) {
  const userCtx = useContext(UserContext)
  const router = useRouter()

  const [locked, setLocked] = useState<boolean>([
    GenTokFlag.AUTO_DETECT_COPY,
    GenTokFlag.REPORTED,
    GenTokFlag.MALICIOUS,
    GenTokFlag.HIDDEN
  ].includes(objkt.issuer.flag))

  const { state, loading: contractLoading, error: contractError, success, call, clear } = 
    useContractOperation<TListingAcceptOperationParams>(ListingAcceptOperation)

  const callContract = () => {
    call({
      listing: listing,
      objkt: objkt,
    })
  }

  const isOwner = (objkt.owner?.id === userCtx.user?.id)

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
        {!isOwner && (
          <>
          <Button
            state={contractLoading ? "loading" : "default"}
            color="secondary"
            onClick={callContract}
            disabled={locked}
          >
            purchase token - <DisplayTezos
              mutez={listing.price}
              tezosSize="regular"
              formatBig={false}
            />
          </Button>

          {locked && (
            <Unlock
              locked={true}
              onClick={() => setLocked(false)}
            />
          )}
          </>
        )}
      </div>
    </>
  )
}