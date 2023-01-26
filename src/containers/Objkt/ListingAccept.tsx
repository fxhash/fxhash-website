import style from "./MarketplaceActions.module.scss"
import { useCallback, useContext, useState } from "react"
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
import {
  ListingAcceptOperation,
  TListingAcceptOperationParams,
} from "../../services/contract-operations/ListingAccept"
import { DisplayTezos } from "../../components/Display/DisplayTezos"
import { ButtonPaymentCard } from "../../components/Utils/ButtonPaymentCard"
import WinterCheckout from "../../components/CreditCard/WinterCheckout"
import { winterCheckoutAppearance } from "../../utils/winter"
import { getUserProfileLink } from "../../utils/user"

interface Props {
  listing: Listing
  objkt: Objkt
}

export function ListingAccept({ listing, objkt }: Props) {
  const [showWinterCheckout, setShowWinterCheckout] = useState(false)
  const userCtx = useContext(UserContext)
  const router = useRouter()

  const [locked, setLocked] = useState<boolean>(
    [
      GenTokFlag.AUTO_DETECT_COPY,
      GenTokFlag.REPORTED,
      GenTokFlag.MALICIOUS,
      GenTokFlag.HIDDEN,
    ].includes(objkt.issuer.flag)
  )

  const {
    state,
    loading: contractLoading,
    error: contractError,
    success,
    call,
  } = useContractOperation<TListingAcceptOperationParams>(
    ListingAcceptOperation
  )

  const handleToggleWinterCheckout = useCallback(
    (newState) => () => {
      setShowWinterCheckout(newState)
    },
    []
  )

  const handleGoToCollection = useCallback(() => {
    setShowWinterCheckout(false)
    if (userCtx.user) {
      router.push(`${getUserProfileLink(userCtx.user)}/collection`)
    }
  }, [router, userCtx.user])

  const callContract = () => {
    call({
      listing: listing,
      objkt: objkt,
    })
  }

  const isOwner = objkt.owner?.id === userCtx.user?.id
  return (
    <>
      <ContractFeedback
        state={state}
        loading={contractLoading}
        success={success}
        error={contractError}
        successMessage="You have collected this token !"
      />
      {showWinterCheckout && (
        <span className={cs(style.infos)}>Opening payment card widget</span>
      )}

      <div className={cs(style.lock_container)}>
        {!isOwner && (
          <>
            <Button
              state={
                contractLoading || showWinterCheckout ? "loading" : "default"
              }
              color="secondary"
              size="regular"
              onClick={callContract}
              disabled={locked}
            >
              purchase token -{" "}
              <DisplayTezos
                mutez={listing.price}
                tezosSize="regular"
                formatBig={false}
              />
            </Button>
            {!contractLoading && !showWinterCheckout && (
              <ButtonPaymentCard
                onClick={handleToggleWinterCheckout(true)}
                disabled={locked}
              />
            )}
            {locked && (
              <Unlock locked={true} onClick={() => setLocked(false)} />
            )}
          </>
        )}
      </div>
      <WinterCheckout
        showModal={showWinterCheckout}
        production={process.env.NEXT_PUBLIC_TZ_NET === "mainnet"}
        walletAddress={userCtx.user?.id}
        contractVersion={listing.version}
        listingId={listing.id}
        onClose={handleToggleWinterCheckout(false)}
        onFinish={handleGoToCollection}
        appearance={winterCheckoutAppearance}
      />
    </>
  )
}
