import style from "./MintController.module.scss"
import layout from "../../styles/Layout.module.scss"
import Link from "next/link"
import cs from "classnames"
import {
  GenerativeToken,
  GenerativeTokenVersion,
} from "../../types/entities/GenerativeToken"
import { Spacing } from "../Layout/Spacing"
import { Button } from "../../components/Button"
import { PropsWithChildren, useContext, useMemo, useState } from "react"
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
import WinterCheckout, {
  IWinterMintPass,
} from "components/CreditCard/WinterCheckout"
import { useRouter } from "next/router"
import { useAsyncMemo } from "use-async-memo"
import { winterCheckoutAppearance } from "../../utils/winter"
import { TContractOperation } from "../../services/contract-operations/ContractOperation"
import {
  MintV3Operation,
  TMintV3OperationParams,
} from "../../services/contract-operations/MintV3"
import { ButtonMintTicketPurchase } from "../MintTicket/ButtonMintTicketPurchase"
import { User } from "../../types/entities/User"
import { MintTicket } from "../../types/entities/MintTicket"
import { generateMintTicketFromMintAction } from "../../utils/mint-ticket"
import { isOperationApplied } from "services/Blockchain"
import { TzktOperation } from "types/Tzkt"
import { LiveMintingContext } from "context/LiveMinting"
import useFetch, { CachePolicies } from "use-http"
import { useFetchRandomSeed } from "hooks/useFetchRandomSeed"
import { useMintReserveInfo } from "hooks/useMintReserveInfo"
import { checkIsEligibleForMintWithAutoToken } from "utils/generative-token"
import { prepareReserveConsumption } from "utils/pack/reserves"
import { useOnChainData } from "hooks/useOnChainData"

interface Props {
  token: GenerativeToken
  forceDisabled?: boolean
  forceReserveConsumption?: boolean
  generateRevealUrl?: (params: {
    tokenId: number
    hash: string | null
    iteration: number
  }) => string
  hideMintButtonAfterReveal?: boolean
  className?: string
}

interface MintTransformer<T> {
  operation: TContractOperation<T>
  getParams: (data: {
    token: GenerativeToken
    price: number
    reserveConsumption: IReserveConsumption | null
  }) => T
}
const mintOpsByVersion: Record<GenerativeTokenVersion, MintTransformer<any>> = {
  PRE_V3: {
    operation: MintOperation,
    getParams: (data) => {
      return {
        token: data.token,
        price: data.price,
        consumeReserve: data.reserveConsumption,
      }
    },
  } as MintTransformer<TMintOperationParams>,
  V3: {
    operation: MintV3Operation,
    getParams: (data) => {
      return {
        token: data.token,
        price: data.price,
        consumeReserve: data.reserveConsumption,
        createTicket: data.token.inputBytesSize > 0,
        inputBytes: "",
      }
    },
  } as MintTransformer<TMintV3OperationParams>,
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
  const liveMintingContext = useContext(LiveMintingContext)
  const { event, mintPass, authToken, paidLiveMinting } = liveMintingContext
  const router = useRouter()

  // the mint context, handles display logic
  const mintingState = useMintingState(token, forceDisabled)
  const { hidden, enabled, locked, price } = mintingState
  const { onMintShouldUseReserve, reserveConsumptionMethod } =
    useMintReserveInfo(token, forceReserveConsumption)

  // the credit card minting state
  const [showCC, setShowCC] = useState<boolean>(false)
  const [loadingCC, setLoadingCC] = useState<boolean>(false)
  const [opHashCC, setOpHashCC] = useState<string | null>(null)
  const [reserveInputCC, setReserveInputCC] = useState<any>(null)
  const [mintPassCC, setMintPassCC] = useState<IWinterMintPass | null>(null)

  // free live minting
  const [opHashFree, setOpHashFree] = useState<string | null>(null)
  const [errorFree, setErrorFree] = useState<string | null>(null)
  const { post: postFree, loading: loadingFree } = useFetch(
    process.env.NEXT_PUBLIC_API_EVENTS_ROOT,
    {
      cachePolicy: CachePolicies.NO_CACHE,
    }
  )

  const mintOperation = mintOpsByVersion[token.version]
  // hook to interact with the contract
  const { state, loading, success, call, error, opHash, opData, clear } =
    useContractOperation<TMintOperationParams | TMintV3OperationParams>(
      mintOperation.operation
    )

  /**
   * can be used to call the mint entry point of the smart contract, or to
   * request the backend to mint the token on behalf of the user
   */
  //
  const mint = async (reserveConsumption: IReserveConsumption | null) => {
    if (!user) throw new Error("No wallet connected")

    if (
      liveMintingContext.event?.freeLiveMinting &&
      checkIsEligibleForMintWithAutoToken(token, liveMintingContext)
    ) {
      const opHash = await postFree("/request-mint", {
        projectId: token.id,
        eventId: "autonomy-test",
        token: mintPass?.token || authToken,
        recipient: user.id,
        createTicket: token.inputBytesSize > 0,
      })
      if (opHash.error) {
        setErrorFree(opHash.error)
        return
      }
      setOpHashFree(opHash)
      return
    }

    // reset other op hashes in case of new direct BC transaction
    setOpHashFree(null)
    setOpHashCC(null)
    call(
      mintOperation.getParams({
        token: token,
        price: price,
        reserveConsumption,
      })
    )
  }

  // the mint pass settings for winter
  const winterPassSettings = onMintShouldUseReserve
    ? reserveConsumptionMethod
    : null

  // called to open the credit card window
  const openCreditCard = async () => {
    clear()
    setLoadingCC(true)
    setOpHashCC(null)
    setReserveInputCC(null)
    setMintPassCC(null)

    if (winterPassSettings) {
      try {
        const { reserveInput, payloadPacked, payloadSignature } =
          await prepareReserveConsumption(winterPassSettings)
        setReserveInputCC(reserveInput)

        const isMintPass = payloadPacked && payloadSignature
        if (isMintPass)
          setMintPassCC({
            address: winterPassSettings.data.reserveData,
            parameters: {
              payload: payloadPacked,
              signature: payloadSignature,
            },
          })
      } catch (err) {
        console.log(err)
        return
      }
    }
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
  const finalOpHash = opHashCC || opHash || opHashFree

  const { randomSeed, loading: randomSeedLoading } =
    useFetchRandomSeed(finalOpHash)

  const { data: iteration } = useOnChainData(finalOpHash, (ops) => {
    const gentkMintOp = ops.find((op) => !!op.parameter.value.iteration)
    if (!gentkMintOp) throw new Error("No mint op found")
    return gentkMintOp.parameter.value.iteration
  })

  const finalLoading = loading || loadingCC || loadingFree || randomSeedLoading

  const revealUrl = generateRevealUrl
    ? generateRevealUrl({
        tokenId: token.id,
        hash: randomSeed,
        iteration,
      })
    : `/reveal/${token.id}/?${new URLSearchParams({
        fxhash: randomSeed,
        fxiteration: iteration,
        fxminter: user!.id,
      }).toString()}`

  const isTicketMinted = token.inputBytesSize > 0

  // outputs ticket transaction or null, taking credit card into account
  const finalOp = useAsyncMemo(async () => {
    if (!isTicketMinted) return null
    // if credit card, return the op of the credit card
    if (opHashCC) {
      let op: TzktOperation[] | null = null
      try {
        op = await isOperationApplied(opHashCC)
      } catch (err: any) {}
      return op
    }
    // return the classic op data
    else {
      return opData
    }
  }, [isTicketMinted, opData, opHashCC])

  const mintedTicket = useMemo<MintTicket | null>(() => {
    if (!isTicketMinted) return null
    if (!finalOp) return null
    return generateMintTicketFromMintAction(finalOp, token, user as User)
  }, [isTicketMinted, finalOp, token, user])

  return (
    <div className={cs(className || style.root)}>
      {token.balance > 0 && (
        <MintingState token={token} existingState={mintingState} verbose />
      )}

      {loadingCC && (
        <span className={cs(style.infos)}>Opening payment card widget</span>
      )}

      {opHashCC ? (
        <span className={cs(style.success)}>
          You have purchased your {mintedTicket ? "ticket" : "unique iteration"}
          !
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

      {opHashFree && (
        <span className={cs(style.success)}>
          You have collected your {mintedTicket ? "ticket" : "unique iteration"}
          !
        </span>
      )}

      {errorFree && (
        <span className={cs(style.error)}>
          An error occurred requesting your mint - please try again or rescan
          the QR code if the error persists.
        </span>
      )}

      {finalOpHash && (
        <>
          {isTicketMinted && mintedTicket && (
            <ButtonMintTicketPurchase
              mintTicket={mintedTicket}
              showModalOnRender
            />
          )}

          {!isTicketMinted && randomSeed && (
            <Link href={revealUrl} passHref>
              <Button
                className={style.button}
                isLink
                color="secondary"
                iconComp={<i aria-hidden className="fas fa-arrow-right" />}
                iconSide="right"
                size="regular"
              >
                reveal
              </Button>
            </Link>
          )}
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
            <MintButton
              token={token}
              loading={finalLoading}
              disabled={!enabled || locked}
              onMint={mint}
              forceReserveConsumption={forceReserveConsumption}
              hasCreditCardOption
              openCreditCard={openCreditCard}
            >
              <span className={style.mint}>
                {!paidLiveMinting && (
                  <>mint {isTicketMinted ? "ticket" : "iteration"}</>
                )}
                {!event?.freeLiveMinting && (
                  <>
                    &nbsp;&nbsp;
                    <DisplayTezos
                      mutez={price}
                      tezosSize="regular"
                      formatBig={false}
                    />
                  </>
                )}
              </span>
            </MintButton>
          )}

          {children}
        </div>
      )}

      <WinterCheckout
        showModal={showCC}
        production={process.env.NEXT_PUBLIC_TZ_NET === "mainnet"}
        projectId={8044}
        gentkId={token.id}
        walletAddress={user?.id}
        onClose={closeCreditCard}
        onSuccess={onCreditCardSuccess}
        onFinish={() => {
          if (!isTicketMinted) {
            router.push(revealUrl)
          }
          setShowCC(false)
        }}
        appearance={winterCheckoutAppearance}
        additionalPurchaseParams={{
          mintPass: mintPassCC,
          create_ticket: isTicketMinted ? "" : null,
          input_bytes: "",
          referrer: null,
          reserve_input: reserveInputCC,
          recipient: user?.id,
        }}
      />
    </div>
  )
}
