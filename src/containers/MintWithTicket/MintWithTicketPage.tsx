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
import { PanelRoot } from "./Panel/PanelRoot"
import {
  concatParamConfiguration,
  ParamConfiguration,
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
import { useFxParams } from "hooks/useFxParams"
import { MintV3AbstractionOperation } from "../../services/contract-operations/MintV3Abstraction"
import { useSettingsContext } from "../../context/Theme"
import { PreMintWarning } from "./PreMintWarning"
import { ResizableArea } from "../../components/ResizableArea/ResizableArea"
import { ButtonIcon } from "components/Button/ButtonIcon"
import { PanelGroup } from "./Panel/PanelGroup"
import { ParamConfigurationList } from "./ParamConfigurationList"
import { PanelSubmitMode } from "./Panel/PanelControls"
import { format } from "date-fns"
import { truncateEnd } from "utils/strings"

export type TOnMintHandler = (ticketId: number | null) => void

interface Props {
  token: GenerativeToken
  ticketId?: number
  mode?: PanelSubmitMode
}
export function MintWithTicketPageRoot({ token, ticketId, mode }: Props) {
  const { showTicketPreMintWarning } = useSettingsContext()
  const [showLoadConfigModal, setShowLoadConfigModal] = useState(false)
  const [showPreMintWarningView, setShowPreMintWarningView] = useState(false)
  const [selectedTicketId, setSelectedTicketId] = useState<number | null>(null)
  const panelParamsRef = useRef<PanelParamsRef>(null)
  const historyContext = useContext(ParamsHistoryContext)
  const artworkIframeRef = useRef<ArtworkIframeRef>(null)
  const router = useRouter()
  const [hasLocalChanges, setHasLocalChanges] = useState<boolean>(false)
  const [withAutoUpdate, setWithAutoUpdate] = useState<boolean>(true)
  const [lockedParamIds, setLockedParamIds] = useState<string[]>([])
  const [tempConfig, setTempConfig] = useState<ParamConfiguration>()
  const { params, features, onIframeLoaded } =
    useReceiveTokenInfos(artworkIframeRef)

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

  const storedConfigurations =
    historyContext.storedConfigurations[`${token.id}`]

  const paramConfigExists = storedConfigurations?.some(
    (c) => concatParamConfiguration(c) === `${hash}-${inputBytes}`
  )

  const url = useMemo<string>(() => {
    return ipfsUrlWithHashAndParams(
      token.metadata.generativeUri,
      hash,
      inputBytes
    )
  }, [token.metadata.generativeUri, hash, inputBytes])

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

  // call contract v3 mint with ticket
  const handleMint: TOnMintHandler = useCallback(
    (_ticketId) => {
      if (inputBytes) {
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

  const handleValidatePreMint = useCallback(() => {
    handleMint(selectedTicketId)
  }, [handleMint, selectedTicketId])

  const handleSaveConfiguration = () => {
    if (paramConfigExists) return
    const now = Date.now()
    historyContext.saveConfiguration(`${token.id}`, {
      name: `${truncateEnd(`${Object.values(data)[0]}`, 20)} - ${format(
        new Date(now),
        "MM/dd/yyyy hh:mm"
      )}`,
      hash,
      inputBytes: inputBytes || "",
      createdAt: now,
    })
  }

  const handleOpenLoadConfigurationModal = () => {
    setShowLoadConfigModal(true)
    setTempConfig({
      name: "Temp Config",
      hash,
      inputBytes: inputBytes || "",
      createdAt: Date.now(),
    })
  }

  const handleCloseLoadConfigurationModal = () => {
    setShowLoadConfigModal(false)
    if (!tempConfig) return
    const data = deserializeParams(tempConfig.inputBytes, params, {
      withTransform: true,
    })
    setData(data)
    panelParamsRef?.current?.updateData(data)
    setHash(tempConfig.hash)
    setHasLocalChanges(false)
    setShowLoadConfigModal(false)
  }

  const handleLoadConfiguration = (config: ParamConfiguration) => {
    const data = deserializeParams(config.inputBytes, params, {
      withTransform: true,
    })
    historyContext.pushHistory({
      type: "config-update",
      oldValue: {
        data: deserializeParams(inputBytes || "", params, {
          withTransform: true,
        }),
        hash,
      },
      newValue: { data, hash: config.hash },
    })
    setData(data)
    panelParamsRef?.current?.updateData(data)
    setHash(config.hash)
    setHasLocalChanges(false)
    setShowLoadConfigModal(false)
  }

  const handlePreviewConfiguration = (config: ParamConfiguration) => {
    const data = deserializeParams(config.inputBytes, params, {
      withTransform: true,
    })
    setData(data)
    panelParamsRef?.current?.updateData(data)
    setHash(config.hash)
    setHasLocalChanges(false)
  }

  const handleUpdateConfigName = (idx: number, name: string) => {
    historyContext.updateConfigName(`${token.id}`, idx, name)
  }
  const handleRemoveConfig = (idx: number) => {
    historyContext.removeConfig(`${token.id}`, idx)
    if (storedConfigurations.length === 1) {
      setShowLoadConfigModal(false)
    }
  }

  useEffect(() => {
    historyContext.registerAction("params-update", (value: any) => {
      panelParamsRef?.current?.updateData(value)
      setData(value)
    })
    historyContext.registerAction("hash-update", (value: any) => {
      setHash(value)
    })
    historyContext.registerAction("config-update", (value: any) => {
      setHash(value.hash)
      panelParamsRef?.current?.updateData(value.data)
      setData(value.data)
    })
  }, [panelParamsRef, params, setHash, historyContext, withAutoUpdate])

  return (
    <div className={style.root}>
      <ResizableArea
        resizableComponent={({ show, onToggleVisibility }) => (
          <div className={cs(style.panel)}>
            <PanelRoot
              disableWarningAnimation={!showTicketPreMintWarning}
              show={show}
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
              onSubmit={handleClickSubmit}
              onClickHide={onToggleVisibility(false)}
              onClickRefresh={handleClickRefresh}
              hideSubmit={ticketId == null}
              mode={mode}
              onSaveConfiguration={handleSaveConfiguration}
              onOpenLoadConfigurationModal={handleOpenLoadConfigurationModal}
              disableOpenLoadConfigurationButton={
                !storedConfigurations || storedConfigurations?.length === 0
              }
              disableSaveConfigurationButton={paramConfigExists}
            />
            {showLoadConfigModal && (
              <div className={cs(style.overlay, style.loadPanel)}>
                <PanelGroup
                  title="Load saved params"
                  headerComp={
                    <ButtonIcon
                      onClick={handleCloseLoadConfigurationModal}
                      icon="fa-solid fa-xmark"
                    />
                  }
                />
                {storedConfigurations && (
                  <ParamConfigurationList
                    items={storedConfigurations}
                    params={params}
                    onLoadConfiguration={handleLoadConfiguration}
                    onPreviewConfiguration={handlePreviewConfiguration}
                    onUpdateConfigName={handleUpdateConfigName}
                    onRemoveConfig={handleRemoveConfig}
                  />
                )}
              </div>
            )}
            {(loading || success) && (
              <div
                className={cs(style.overlay, style.layout_centered, {
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
                    href={`/reveal/${token.id}/?fxhash=${opHash}&fxparams=${inputBytes}`}
                    passHref
                  >
                    <Button
                      isLink
                      size="regular"
                      color="secondary"
                      iconComp={
                        <i aria-hidden className="fas fa-arrow-right" />
                      }
                      iconSide="right"
                    >
                      final reveal
                    </Button>
                  </Link>
                )}
              </div>
            )}
            {showPreMintWarningView && (
              <div
                className={cs(
                  style.overlay,
                  style.layout_centered,
                  style.pre_mint
                )}
              >
                <PreMintWarning
                  onChangeHash={handleChangeHash}
                  onMint={handleValidatePreMint}
                  onClose={handleClosePreMintView}
                />
              </div>
            )}
          </div>
        )}
      >
        <div className={cs(style.frame)}>
          <ArtworkIframe
            ref={artworkIframeRef}
            url={url}
            onLoaded={onIframeLoaded}
          />
          {hasLocalChanges && (
            <div className={style.unsyncedContainer}>
              <div className={style.unsyncedContent}>
                <i className="fa-solid fa-circle-exclamation" />
                <p>
                  Params are not synced with the token. <br /> Enable
                  auto-refresh or manually refresh the view.
                </p>
              </div>
            </div>
          )}
        </div>
      </ResizableArea>
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
