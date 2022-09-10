import style from "./MintController.module.scss"
import layout from "../../styles/Layout.module.scss"
import Link from "next/link"
import cs from "classnames"
import { GenerativeToken } from "../../types/entities/GenerativeToken"
import { Spacing } from "../Layout/Spacing"
import { Button } from "../../components/Button"
import { PropsWithChildren, useContext, useEffect, useMemo } from "react"
import { ContractFeedback } from "../Feedback/ContractFeedback"
import { DisplayTezos } from "../Display/DisplayTezos"
import { useContractOperation } from "../../hooks/useContractOperation"
import { IReserveConsumption, MintOperation, TMintOperationParams } from "../../services/contract-operations/Mint"
import { MintingState } from "./MintingState/MintingState"
import { useMintingState } from "../../hooks/useMintingState"
import { UserContext } from "../../containers/UserProvider"
import { reserveEligibleAmount, reserveSize } from "../../utils/generative-token"
import { User } from "../../types/entities/User"
import { MintButton } from "./MintButton"

interface Props {
  token: GenerativeToken
  forceDisabled?: boolean
  forceReserveConsumption?: boolean
  generateRevealUrl?: (params: { tokenId: number, hash: string | null }) => string
  onReveal?: (hash: string) => void
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
  generateRevealUrl,
  onReveal,
  className,
  children,
}: PropsWithChildren<Props>) {
  // the mint context, handles display logic
  const mintingState = useMintingState(token, forceDisabled)
  const {
    hidden,
    enabled,
    locked,
    price,
  } = mintingState

  // hook to interact with the contract
  const { state, loading, success, call, error, opHash } =
    useContractOperation<TMintOperationParams>(MintOperation)

  const mint = (reserveConsumption: IReserveConsumption|null) => {
    call({
      token: token,
      price: price,
      consumeReserve: reserveConsumption
    })
  }

  const revealUrl = generateRevealUrl ? generateRevealUrl({ tokenId: token.id, hash: opHash }) : `/reveal/${token.id}/${opHash}`
  // whenever there is a transaction hash, we can tell the mint was
  // successful
  useEffect(() => {
    if (opHash) {
      onReveal?.(opHash)
    }
  }, [opHash]);

  return (
    <div className={cs(className || style.root)}>

      {token.balance > 0 && (
        <MintingState
          token={token}
          existingState={mintingState}
          verbose
        />
      )}

      <ContractFeedback
        state={state}
        error={error}
        success={success}
        loading={loading}
        className={cs(style.contract_feedback)}
      />

      {opHash && (
        <>
          <Link href={revealUrl} passHref>
            <Button
              isLink
              color="secondary"
              iconComp={<i aria-hidden className="fas fa-arrow-right"/>}
              iconSide="right"
              size="regular"
            >
              reveal
            </Button>
          </Link>
          <Spacing size="regular"/>
        </>
      )}

      {!token.enabled && token.balance > 0 && (
        <>
          <small>
            <span>Token is currently <strong>disabled</strong> by author</span>
            {enabled && (
              <span>
                <br/>
                But as the author, you can still mint
              </span>
            )}
          </small>
          <Spacing size="2x-small"/>
        </>
      )}

      <div className={cs(
        layout.buttons_inline, layout.flex_wrap, style.buttons_wrapper
      )}>
        {!hidden && (
          <MintButton
            token={token}
            loading={loading}
            disabled={!enabled || locked}
            onMint={mint}
            forceReserveConsumption={forceReserveConsumption}
          >
            mint iteration&nbsp;&nbsp;<DisplayTezos mutez={price} tezosSize="regular" formatBig={false} />
          </MintButton>
        )}

        {children}
      </div>
    </div>
  )
}
