import style from "./MintWithTicketPage.module.scss"
import cs from "classnames"
import { GenerativeToken } from "types/entities/GenerativeToken"
import {
  ArtworkIframe,
  ArtworkIframeRef,
} from "components/Artwork/PreviewIframe"
import { ipfsUrlWithHashAndParams } from "../../utils/ipfs"
import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react"
import { deserializeParams } from "components/FxParams/utils"
import { useReceiveTokenInfos } from "hooks/useReceiveTokenInfos"
import { PanelRoot, PanelSubmitMode } from "./Panel/PanelRoot"
import {
  ParamsHistoryContext,
  ParamsHistoryProvider,
} from "components/FxParams/ParamsHistory"
import { PanelParamsRef } from "./Panel/PanelParams"
import { useRouter } from "next/router"
import { useContractOperation } from "hooks/useContractOperation"
import { ContractFeedback } from "components/Feedback/ContractFeedback"
import { Loader } from "components/Utils/Loader"
import Link from "next/link"
import { Button } from "components/Button"
import useWindowSize, { breakpoints } from "../../hooks/useWindowsSize"
import { useFxParams } from "hooks/useFxParams"
import { MintV3AbstractionOperation } from "../../services/contract-operations/MintV3Abstraction"
import { useSettingsContext } from "../../context/Theme"
import { PreMintWarning } from "./PreMintWarning"
import { UserContext } from "containers/UserProvider"
import { generateTzAddress } from "utils/hash"

export type TOnMintHandler = (ticketId: number | null) => void

interface Props {
  token: GenerativeToken
  ticketId?: number
  mode?: PanelSubmitMode
}
export function MintWithTicketPageRoot({ token, ticketId, mode }: Props) {
  const { showTicketPreMintWarning } = useSettingsContext()
  const { width } = useWindowSize()
  const isMobile = useMemo(() => {
    return (width || 0) < breakpoints.sm
  }, [width])
  const [showPanel, setShowPanel] = useState(!isMobile)
  const [showPreMintWarningView, setShowPreMintWarningView] = useState(false)
  const [selectedTicketId, setSelectedTicketId] = useState<number | null>(null)
  const panelParamsRef = useRef<PanelParamsRef>(null)
  const historyContext = useContext(ParamsHistoryContext)
  const artworkIframeRef = useRef<ArtworkIframeRef>(null)
  const lastHistoryActionData = useRef<any>()
  const router = useRouter()
  const [hasLocalChanges, setHasLocalChanges] = useState<boolean>(false)
  const [withAutoUpdate, setWithAutoUpdate] = useState<boolean>(true)
  const [lockedParamIds, setLockedParamIds] = useState<string[]>([])
  const { params, features, onIframeLoaded } =
    useReceiveTokenInfos(artworkIframeRef)

  // get the user to get their tezos address, or a random tz address
  const { user } = useContext(UserContext)
  const randomAddress = useMemo(() => generateTzAddress(), [])
  const minterAddress = useMemo(() => {
    return user?.id || randomAddress
  }, [user, randomAddress])

  const handleClosePreMintView = useCallback(() => {
    setShowPreMintWarningView(false)
    setSelectedTicketId(null)
  }, [])

  const { data, setData, hash, setHash, inputBytes } = useFxParams(params)
  const { call, success, loading, state, error, opHash } = useContractOperation(
    MintV3AbstractionOperation,
    {
      onSuccess: () => {
        if (showPreMintWarningView) {
          handleClosePreMintView()
        }
      },
    }
  )

  const url = useMemo<string>(() => {
    return ipfsUrlWithHashAndParams(
      token.metadata.generativeUri,
      hash,
      minterAddress,
      inputBytes
    )
  }, [token.metadata.generativeUri, hash, minterAddress, inputBytes])

  const handleToggleShowPanel = useCallback(
    (newState) => () => setShowPanel(newState),
    []
  )
  const handleChangeData = (newData: Record<string, any>) => {
    historyContext.pushHistory({
      type: "params-update",
      oldValue: deserializeParams(inputBytes || "", params, {
        withTransform: true,
      }),
      newValue: newData,
    })
    setData(newData)
    setHasLocalChanges(false)
  }

  const handleChangeHash = (newHash: string) => {
    historyContext.pushHistory({
      type: "hash-update",
      oldValue: hash,
      newValue: newHash,
    })
    setHash(newHash)
  }

  const handleOpenNewTab = () => {
    window.open(url)
  }

  const handleClickBack = () => {
    router.push("/generative/[...params]", `/generative/slug/${token.slug}`)
  }

  const handleClickRefresh = () => {
    artworkIframeRef.current?.reloadIframe()
  }

  const handleLocalDataChange = () => {
    if (withAutoUpdate) return
    setHasLocalChanges(true)
  }

  console.log(token)

  // call contract v3 mint with ticket
  const handleMint: TOnMintHandler = useCallback(
    (_ticketId) => {
      if (inputBytes) {
        console.log(inputBytes)
        console.log(inputBytes.length / 2)
        // if we are minting with a ticket passed as a propo
        if (mode === "with-ticket") {
          if (ticketId != null) {
            call({
              token: token,
              ticketId: ticketId,
              inputBytes: inputBytes,
            })
          }
        }
        // else we are minting using settings passed to this function
        else if (mode === "free") {
          call({
            token: token,
            ticketId: _ticketId,
            inputBytes: inputBytes,
          })
        }
      }
    },
    [call, inputBytes, mode, ticketId, token]
  )

  const handleClickSubmit: TOnMintHandler = useCallback(
    (_ticketId) => {
      if (showTicketPreMintWarning) {
        setShowPreMintWarningView(true)
        setSelectedTicketId(_ticketId)
      } else {
        handleMint(_ticketId)
      }
    },
    [handleMint, showTicketPreMintWarning]
  )

  const handleClickArtwork = useCallback(() => {
    if (isMobile && showPanel) {
      setShowPanel(false)
    }
  }, [isMobile, showPanel])

  const handleValidatePreMint = useCallback(() => {
    handleMint(selectedTicketId)
  }, [handleMint, selectedTicketId])

  useEffect(() => {
    historyContext.registerAction("params-update", (value: any) => {
      panelParamsRef?.current?.updateData(value)
      setData(value)
    })
    historyContext.registerAction("hash-update", (value: any) => {
      setHash(value)
    })
  }, [
    lastHistoryActionData,
    panelParamsRef,
    params,
    setHash,
    historyContext,
    withAutoUpdate,
  ])

  useEffect(() => {
    setShowPanel(!isMobile)
  }, [isMobile])

  return (
    <div className={cs(style.root)}>
      {!showPanel && (
        <button
          title="show panel"
          className={style.button_show}
          type="button"
          onClick={handleToggleShowPanel(true)}
        >
          <span>Edit</span>
          <i aria-hidden className="fa-sharp fa-solid fa-chevrons-right" />
        </button>
      )}
      <div
        className={cs(style.panel, {
          [style.show]: showPanel,
        })}
      >
        <PanelRoot
          disableWarningAnimation={!showTicketPreMintWarning}
          show={showPanel}
          data={data}
          params={params}
          features={features}
          hash={hash}
          token={token}
          onLocalDataChange={handleLocalDataChange}
          onChangeData={handleChangeData}
          onChangeHash={handleChangeHash}
          lockedParamIds={lockedParamIds}
          onChangeLockedParamIds={setLockedParamIds}
          history={historyContext.history}
          historyOffset={historyContext.offset}
          onUndo={historyContext.undo}
          onRedo={historyContext.redo}
          panelParamsRef={panelParamsRef}
          withAutoUpdate={withAutoUpdate}
          onChangeWithAutoUpdate={setWithAutoUpdate}
          onOpenNewTab={handleOpenNewTab}
          onClickBack={handleClickBack}
          onClickSubmit={handleClickSubmit}
          onClickHide={handleToggleShowPanel(false)}
          onClickRefresh={handleClickRefresh}
          hideSubmit={ticketId == null}
          mode={mode}
        />
        {(loading || success) && (
          <div
            className={cs(style.mint_overlay, {
              [style.has_success]: success,
            })}
          >
            <div className={cs(style.kt_feedback)}>
              <ContractFeedback
                state={state}
                success={success}
                loading={loading}
                error={error}
                successMessage="Your iteration is minted!"
              />
            </div>
            {loading && <Loader size="small" color="currentColor" />}
            {success && (
              <Link
                href={`/reveal/${token.id}/?fxhash=${opHash}&fxminter=${user?.id}&fxparams=${inputBytes}`}
                passHref
              >
                <Button
                  isLink
                  size="regular"
                  color="secondary"
                  iconComp={<i aria-hidden className="fas fa-arrow-right" />}
                  iconSide="right"
                >
                  final reveal
                </Button>
              </Link>
            )}
          </div>
        )}
        {showPreMintWarningView && (
          <div className={cs(style.mint_overlay, style.pre_mint)}>
            <PreMintWarning
              onChangeHash={handleChangeHash}
              onMint={handleValidatePreMint}
              onClose={handleClosePreMintView}
            />
          </div>
        )}
      </div>
      <div
        className={cs(style.frame, {
          [style.minimize]: showPanel,
        })}
      >
        <ArtworkIframe
          ref={artworkIframeRef}
          url={url}
          onLoaded={onIframeLoaded}
        />
        <div className={style.frame_mask} onClick={handleClickArtwork} />
        {hasLocalChanges && (
          <div className={style.unsyncedContainer}>
            <div className={style.unsyncedContent}>
              <i className="fa-solid fa-circle-exclamation" />
              <p>
                Params are not synced with the token. <br /> Enable auto-refresh
                or manually refresh the view.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export function MintWithTicketPage(props: Props) {
  return (
    <ParamsHistoryProvider>
      <MintWithTicketPageRoot {...props} />
    </ParamsHistoryProvider>
  )
}
