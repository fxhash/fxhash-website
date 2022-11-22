import style from "./MintController.module.scss"
import layout from "../../styles/Layout.module.scss"
import Link from "next/link"
import cs from "classnames"
import { GenerativeToken } from "../../types/entities/GenerativeToken"
import { Spacing } from "../Layout/Spacing"
import { Button } from "../../components/Button"
import { PropsWithChildren, useContext, useState } from "react"
import { ContractFeedback } from "../Feedback/ContractFeedback"
import { DisplayTezos } from "../Display/DisplayTezos"
import { useContractOperation } from "../../hooks/useContractOperation"
import {
  IReserveConsumption,
  MintOperation,
  TMintOperationParams,
} from "../../services/contract-operations/Mint"
import { MintingState } from "./MintingState/MintingState"
import { useMintingState } from "../../hooks/useMintingState"
import { UserContext } from "../../containers/UserProvider"
import { MintButton } from "./MintButton"
import WinterCheckout from "components/CreditCard/WinterCheckout"
import { ButtonIcon } from "components/Button/ButtonIcon"

interface Props {
  token: GenerativeToken
  forceDisabled?: boolean
  forceReserveConsumption?: boolean
  generateRevealUrl?: (params: {
    tokenId: number
    hash: string | null
  }) => string
  hideMintButtonAfterReveal?: boolean
  className?: string
}

/**
 * This Component controls the minting flow by applying logic to the Generative
 * Token settings in order to derive some UI states.
 * It should:
 *  * control the enabled state of the mint button
 *  * control the price displayed on the button depending on the pricing method
 *  * display some UI state based on the most pertinent information to display
 *    (if locked/opensAt, only show the most recent)
 *  * display some extra details given the state of the pricing
 *    (dutch auction, if active: show time until next decrement, next price)
 */
export function MintController({
  token,
  forceDisabled = false,
  forceReserveConsumption = false,
  hideMintButtonAfterReveal = false,
  generateRevealUrl,
  className,
  children,
}: PropsWithChildren<Props>) {
  const { user } = useContext(UserContext)

  // the mint context, handles display logic
  const mintingState = useMintingState(token, forceDisabled)
  const { hidden, enabled, locked, price } = mintingState

  // the credit card minting state
  const [showCC, setShowCC] = useState<boolean>(false)
  const [loadingCC, setLoadingCC] = useState<boolean>(false)
  const [opHashCC, setOpHashCC] = useState<string | null>(null)

  // hook to interact with the contract
  const { state, loading, success, call, error, opHash, clear } =
    useContractOperation<TMintOperationParams>(MintOperation)

  // can be used to call the mint entry point of the smart contract
  const mint = (reserveConsumption: IReserveConsumption | null) => {
    setOpHashCC(null) // reset CC op hash in case of new direct BC transaction
    call({
      token: token,
      price: price,
      consumeReserve: reserveConsumption,
    })
  }

  // called to open the credit card window
  const openCreditCard = () => {
    clear()
    setLoadingCC(true)
    setOpHashCC(null)
    setShowCC(true)
  }
  const closeCreditCard = () => {
    setLoadingCC(false)
    setShowCC(false)
  }

  // when the credit card payment is successful
  const onCreditCardSuccess = (hash: string, usd: number) => {
    setLoadingCC(false)
    setOpHashCC(hash)
  }

  // derive the op hash of interest from the CC or BC transaction hash
  const finalOpHash = opHashCC || opHash
  const finalLoading = loading || loadingCC

  const revealUrl = generateRevealUrl
    ? generateRevealUrl({ tokenId: token.id, hash: finalOpHash })
    : `/reveal/${token.id}/${finalOpHash}`

  return (
    <div className={cs(className || style.root)}>
      {token.balance > 0 && (
        <MintingState token={token} existingState={mintingState} verbose />
      )}

      {loadingCC && (
        <span className={cs(style.infos)}>Opening credit card widget</span>
      )}

      {opHashCC ? (
        <span className={cs(style.success)}>
          You have purchased your unqiue iteration!
        </span>
      ) : (
        <ContractFeedback
          state={state}
          error={error}
          success={success}
          loading={loading}
          className={cs(style.contract_feedback)}
        />
      )}

      {finalOpHash && (
        <>
          <Link href={revealUrl} passHref>
            <Button
              isLink
              color="secondary"
              iconComp={<i aria-hidden className="fas fa-arrow-right" />}
              iconSide="right"
              size="regular"
            >
              reveal
            </Button>
          </Link>
          <Spacing size="regular" />
        </>
      )}

      {!token.enabled && token.balance > 0 && (
        <>
          <small>
            <span>
              Token is currently <strong>disabled</strong> by author
            </span>
            {enabled && (
              <span>
                <br />
                But as the author, you can still mint
              </span>
            )}
          </small>
          <Spacing size="2x-small" />
        </>
      )}

      {!(opHash && hideMintButtonAfterReveal) && (
        <div
          className={cs(
            layout.buttons_inline,
            layout.flex_wrap,
            style.buttons_wrapper
          )}
        >
          {!hidden && (
            <>
              <MintButton
                token={token}
                loading={finalLoading}
                disabled={!enabled || locked}
                onMint={mint}
                forceReserveConsumption={forceReserveConsumption}
              >
                mint iteration&nbsp;&nbsp;
                <DisplayTezos
                  mutez={price}
                  tezosSize="regular"
                  formatBig={false}
                />
              </MintButton>

              {!finalLoading && (
                <ButtonIcon
                  type="button"
                  icon="fa-sharp fa-solid fa-credit-card"
                  onClick={openCreditCard}
                  color="white"
                  title="Pay with you credit card"
                />
              )}
            </>
          )}

          {children}
        </div>
      )}

      {user && (
        <WinterCheckout
          showModal={showCC}
          production={false}
          projectId={8044}
          gentkId={token.id}
          walletAddress={user.id}
          onClose={closeCreditCard}
          onSuccess={onCreditCardSuccess}
        />
      )}
    </div>
  )
}
