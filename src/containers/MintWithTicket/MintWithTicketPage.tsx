import style from "./MintWithTicketPage.module.scss"
import cs from "classnames"
import { GenerativeToken } from "types/entities/GenerativeToken"
import {
  ArtworkIframe,
  ArtworkIframeRef,
} from "components/Artwork/PreviewIframe"
import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react"
import { deserializeParams } from "components/FxParams/utils"
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
import { UserContext } from "containers/UserProvider"
import { generateFxHash, generateTzAddress } from "utils/hash"
import { ResizableArea } from "../../components/ResizableArea/ResizableArea"
import { ButtonIcon } from "components/Button/ButtonIcon"
import { PanelGroup } from "./Panel/PanelGroup"
import { ParamConfigurationList } from "./ParamConfigurationList"
import { PanelSubmitMode } from "./Panel/PanelControls"
import { format } from "date-fns"
import { truncateEnd } from "utils/strings"
import { IReserveConsumption } from "services/contract-operations/MintV3"
import { useFetchRandomSeed } from "hooks/useFetchRandomSeed"
import { getIteration, useOnChainData } from "hooks/useOnChainData"
import { useRuntimeController } from "hooks/useRuntimeController"
import { FxParamsData } from "components/FxParams/types"

export type TOnMintHandler = (
  ticketId: number | number[] | null,
  reserveConsumption?: IReserveConsumption | null
) => void

interface Props {
  token: GenerativeToken
  ticketId?: number
  mode?: PanelSubmitMode
}
export function MintWithTicketPageRoot({ token, ticketId, mode }: Props) {
  const { showTicketPreMintWarning } = useSettingsContext()
  const [showLoadConfigModal, setShowLoadConfigModal] = useState(false)
  const [showPreMintWarningView, setShowPreMintWarningView] = useState(false)
  const [selectedTicketId, setSelectedTicketId] = useState<
    number | number[] | null
  >(null)
  const [selectedReserveConsumption, setSelectedReserveConsumption] =
    useState<IReserveConsumption | null>(null)
  const panelParamsRef = useRef<PanelParamsRef>(null)
  const historyContext = useContext(ParamsHistoryContext)
  const artworkIframeRef = useRef<ArtworkIframeRef>(null)
  const router = useRouter()
  const [withAutoUpdate, setWithAutoUpdate] = useState<boolean>(true)
  const [lockedParamIds, setLockedParamIds] = useState<string[]>([])
  const [tempConfig, setTempConfig] = useState<ParamConfiguration>()

  // get the user to get their tezos address, or a random tz address
  const { user } = useContext(UserContext)
  const minterAddress = useMemo(() => {
    return user?.id || generateTzAddress()
  }, [user])

  const { runtime, controls, details } = useRuntimeController(
    artworkIframeRef,
    {
      cid: token.metadata.generativeUri,
      hash: (router.query.fxhash as string) || generateFxHash(),
      minter: minterAddress,
      inputBytes: router.query.fxparams as string | undefined,
    },
    {
      autoRefresh: withAutoUpdate,
      urlParams: new URLSearchParams("fxcontext=minting"),
    }
  )

  const updateAutoUpdate = (auto: boolean) => {
    auto && controls.hardSync()
    setWithAutoUpdate(auto)
  }

  const handleClosePreMintView = useCallback(() => {
    setShowPreMintWarningView(false)
    setSelectedTicketId(null)
    setSelectedReserveConsumption(null)
  }, [])

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

  const {
    randomSeed,
    success: randomSeedSuccess,
    loading: randomSeedLoading,
  } = useFetchRandomSeed(opHash)

  const { data: iteration } = useOnChainData(opHash, getIteration)

  const storedConfigurations =
    historyContext.storedConfigurations[`${token.id}`]

  const paramConfigExists = storedConfigurations?.some(
    (c) =>
      concatParamConfiguration(c) ===
      `${runtime.state.hash}-${runtime.details.params.inputBytes}`
  )

  const handleChangeData = (
    newData: FxParamsData,
    forceRefresh: boolean = false
  ) => {
    if (!runtime.definition.params) return
    historyContext.pushHistory({
      type: "params-update",
      oldValue: deserializeParams(
        runtime.details.params.inputBytes || "",
        runtime.definition.params,
        {
          withTransform: true,
        }
      ),
      newValue: newData,
    })
    controls.updateParams(newData, forceRefresh)
  }

  const handleChangeHash = (hash: string) => {
    historyContext.pushHistory({
      type: "hash-update",
      oldValue: runtime.state.hash,
      newValue: hash,
    })
    runtime.state.update({ hash })
  }

  const handleOpenNewTab = () => {
    window.open(details.controlsUrl)
  }

  const handleClickBack = () => {
    if (mode === "live-minting") {
      const { id: eventId, token: mintPassToken } = router.query
      router.push(
        `/live-minting/${eventId}/generative/${token.id}?token=${mintPassToken}`
      )
      return
    }
    router.push("/generative/[...params]", `/generative/slug/${token.slug}`)
  }

  const handleLocalDataChange = () => {
    if (withAutoUpdate) return
  }

  // call contract v3 mint with ticket
  const handleMint: TOnMintHandler = useCallback(
    (_ticketId, reserveConsumption) => {
      if (runtime.details.params.inputBytes) {
        call({
          token: token,
          ticketId: _ticketId,
          inputBytes: runtime.details.params.inputBytes,
          consumeReserve: reserveConsumption,
        })
      }
    },
    [call, runtime.details.params.inputBytes, token]
  )

  const handleClickSubmit: TOnMintHandler = useCallback(
    (_ticketId, reserveConsumption = null) => {
      const ticketIdToMint =
        mode === "with-ticket" && ticketId ? ticketId : _ticketId
      if (showTicketPreMintWarning) {
        setShowPreMintWarningView(true)
        setSelectedTicketId(ticketIdToMint)
        setSelectedReserveConsumption(reserveConsumption)
      } else {
        handleMint(ticketIdToMint, reserveConsumption)
      }
    },
    [handleMint, mode, showTicketPreMintWarning, ticketId]
  )

  const handleValidatePreMint = useCallback(() => {
    handleMint(selectedTicketId, selectedReserveConsumption)
  }, [handleMint, selectedTicketId, selectedReserveConsumption])

  const handleSaveConfiguration = () => {
    if (paramConfigExists) return
    const now = Date.now()
    historyContext.saveConfiguration(`${token.id}`, {
      name: `${truncateEnd(
        `${Object.values(runtime.state.params)[0]}`,
        20
      )} - ${format(new Date(now), "MM/dd/yyyy hh:mm")}`,
      hash: runtime.state.hash,
      inputBytes: runtime.details.params.inputBytes || "",
      createdAt: now,
    })
  }

  const handleOpenLoadConfigurationModal = () => {
    setShowLoadConfigModal(true)
    setTempConfig({
      name: "Temp Config",
      hash: runtime.state.hash,
      inputBytes: runtime.details.params.inputBytes || "",
      createdAt: Date.now(),
    })
  }

  const handleCloseLoadConfigurationModal = () => {
    setShowLoadConfigModal(false)
    if (!runtime.definition.params || !tempConfig) return
    const data = deserializeParams(
      tempConfig.inputBytes,
      runtime.definition.params,
      {
        withTransform: true,
      }
    )
    controls.updateParams(data)
    runtime.state.update({ hash: tempConfig.hash })
    setShowLoadConfigModal(false)
  }

  const handleLoadConfiguration = (config: ParamConfiguration) => {
    if (!runtime.definition.params) return
    const data = deserializeParams(
      config.inputBytes,
      runtime.definition.params,
      {
        withTransform: true,
      }
    )
    historyContext.pushHistory({
      type: "config-update",
      oldValue: {
        data: deserializeParams(
          runtime.details.params.inputBytes || "",
          runtime.definition.params,
          {
            withTransform: true,
          }
        ),
        hash: runtime.state.hash,
      },
      newValue: { data, hash: config.hash },
    })
    controls.updateParams(data)
    runtime.state.update({ hash: config.hash })
    setShowLoadConfigModal(false)
  }

  const handlePreviewConfiguration = (config: ParamConfiguration) => {
    if (!runtime.definition.params || !config.inputBytes) return
    const data = deserializeParams(
      config.inputBytes || "",
      runtime.definition.params,
      {
        withTransform: true,
      }
    )
    controls.updateParams(data)
    runtime.state.update({ hash: config.hash })
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
      controls.updateParams(value)
    })
    historyContext.registerAction("hash-update", (hash: any) => {
      runtime.state.update({ hash })
    })
    historyContext.registerAction("config-update", (value: any) => {
      runtime.state.update({ hash: value.hash })
      controls.updateParams(value.data)
    })
  }, [
    panelParamsRef,
    runtime.definition.params,
    historyContext,
    withAutoUpdate,
    controls,
    runtime.state,
  ])

  // on this view we want the html element bg to be black
  // especially for mobile header being black
  useEffect(() => {
    document.documentElement.classList.add(style.blackHtmlBackground)
    return () => {
      document.documentElement.classList.remove(style.blackHtmlBackground)
    }
  }, [])

  return (
    <div className={style.root}>
      <ResizableArea
        resizableComponent={({ show, onToggleVisibility }) => (
          <div className={cs(style.panel)}>
            <PanelRoot
              disableWarningAnimation={!showTicketPreMintWarning}
              show={show}
              data={controls.state.params.values}
              params={controls.state.params.definition}
              inputBytes={runtime.details.params.inputBytes}
              features={runtime.definition.features}
              hash={runtime.state.hash}
              randomizeIteration={() =>
                runtime.state.update({
                  iteration:
                    token.supply - Math.floor(Math.random() * token.balance),
                })
              }
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
              onChangeWithAutoUpdate={updateAutoUpdate}
              onOpenNewTab={handleOpenNewTab}
              onClickBack={handleClickBack}
              onSubmit={handleClickSubmit}
              onClickHide={onToggleVisibility(false)}
              onClickRefresh={controls.hardSync}
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
                {storedConfigurations && controls.state.params.definition && (
                  <ParamConfigurationList
                    items={storedConfigurations}
                    params={controls.state.params.definition}
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
                {loading && randomSeedLoading && (
                  <Loader size="small" color="currentColor" />
                )}
                {success && randomSeedSuccess && (
                  <Link
                    href={`/reveal/${token.id}/?${new URLSearchParams({
                      fxhash: randomSeed,
                      fxiteration: iteration,
                      fxparams: runtime.details.params.inputBytes!,
                      fxminter: user!.id,
                    }).toString()}`}
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
          <ArtworkIframe ref={artworkIframeRef} />
          {!details.runtimeSynced && !withAutoUpdate && (
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
