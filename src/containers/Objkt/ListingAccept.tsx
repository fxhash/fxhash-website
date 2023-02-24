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
  const [showWinterPaymentOptions, setShowWinterPaymentOptions] =
    useState(false)
  const [winterPaymentMethod, setWinterPaymentMethod] = useState<
    false | string
  >(false)
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
  const handleToggleWinterPaymentOptions = useCallback(
    (newState) => () => {
      setShowWinterPaymentOptions(newState)
    },
    []
  )
  const handleClickWinterPay = useCallback(
    (paymentMethod: string | false) => () => {
      setWinterPaymentMethod(paymentMethod)
      setShowWinterCheckout(true)
    },
    []
  )

  const handleGoToCollection = useCallback(
    (data) => {
      setShowWinterCheckout(false)
      if (data.tzAddress) {
        router.push(`/pkh/${data.tzAddress}/collection`)
      }
    },
    [router]
  )

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
      {(contractLoading || showWinterCheckout) && (
        <div>
          <Button state="loading" color="secondary" />
        </div>
      )}
      {!isOwner && (
        <div className={style.listing_container}>
          <div className={cs(style.lock_container)}>
            <Button
              state={"default"}
              color="secondary"
              size="regular"
              onClick={callContract}
              disabled={locked || contractLoading || showWinterCheckout}
              className={style.button_purchase}
              classNameChildren={style.button_purchase_content}
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
                onClick={handleToggleWinterPaymentOptions(
                  !showWinterPaymentOptions
                )}
                disabled={locked}
                hasDropdown={showWinterPaymentOptions ? "up" : "down"}
              />
            )}
            {locked && (
              <Unlock locked={true} onClick={() => setLocked(false)} />
            )}
          </div>
          <div
            className={cs(style.buttons_pay, {
              [style.open]: showWinterPaymentOptions,
            })}
          >
            <button onClick={handleClickWinterPay(false)}>pay with USD</button>
            <button onClick={handleClickWinterPay("ETH")}>pay with ETH</button>
          </div>
        </div>
      )}
      <WinterCheckout
        showModal={showWinterCheckout}
        production={process.env.NEXT_PUBLIC_TZ_NET === "mainnet"}
        walletAddress={userCtx.user?.id}
        contractVersion={listing.version}
        listingId={listing.id}
        onClose={handleToggleWinterCheckout(false)}
        onFinish={handleGoToCollection}
        appearance={winterCheckoutAppearance}
        fillSource="fxhash.xyz"
        paymentMethod={winterPaymentMethod || ""}
      />
    </>
  )
}
