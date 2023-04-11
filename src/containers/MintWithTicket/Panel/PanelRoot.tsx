import style from "./PanelRoot.module.scss"
import cs from "classnames"
import { PanelHeader, PanelHeaderProps } from "./PanelHeader"
import { PanelParams, PanelParamsProps, PanelParamsRef } from "./PanelParams"
import { PanelFeatures, PanelFeaturesProps } from "./PanelFeatures"
import { PanelHash, PanelHashProps } from "./PanelHash"
import {
  FxParamDefinition,
  FxParamsData,
  FxParamType,
} from "components/FxParams/types"
import { GenerativeToken } from "types/entities/GenerativeToken"
import { IParamsHistoryEntry } from "components/FxParams/ParamsHistory"
import { RefObject, useMemo } from "react"
import { getUserName } from "utils/user"
import { PanelControls, PanelControlsProps } from "./PanelControls"
import { Spacing } from "components/Layout/Spacing"
import { TOnMintHandler } from "../MintWithTicketPage"
import Link from "next/link"

interface PanelRootProps
  extends PanelParamsProps,
    PanelHashProps,
    PanelFeaturesProps,
    PanelControlsProps {
  panelParamsRef?: RefObject<PanelParamsRef>
  onClickHide: () => void
  show: boolean
}

export function PanelRoot(props: PanelRootProps) {
  const {
    show,
    data,
    params,
    hash,
    token,
    features,
    onChangeHash,
    onChangeData,
    lockedParamIds,
    onChangeLockedParamIds,
    history,
    historyOffset,
    onUndo,
    onRedo,
    panelParamsRef,
    onSubmit,
    onOpenNewTab,
    onClickBack,
    withAutoUpdate,
    onChangeWithAutoUpdate,
    onClickHide,
    onClickRefresh,
    onLocalDataChange,
    hideSubmit,
    mode = "none",
    disableWarningAnimation,
    onSaveConfiguration,
    onOpenLoadConfigurationModal,
    disableOpenLoadConfigurationButton,
    disableSaveConfigurationButton,
  } = props
  const name = useMemo(() => getUserName(token.author, 15), [token])

  return (
    <div className={cs(style.root)}>
      <div
        className={cs(style.scrollWrapper, {
          [style.show]: show,
        })}
      >
        <PanelHeader
          title={token.name}
          description={`by ${name}`}
          onClickHide={onClickHide}
        />
        <Spacing size="small" />
        <Link href="/doc/collect/fxparams-mint-tickets">
          <a className={style.learn}>
            <i aria-hidden="true" className="fas fa-book" />
            How to use fx(params)
          </a>
        </Link>
        <Spacing size="regular" />
        <div className={cs(style.body)}>
          <PanelHash
            hash={hash}
            onChangeHash={onChangeHash}
            disableWarningAnimation={disableWarningAnimation}
          />
          <PanelParams
            ref={panelParamsRef}
            data={data}
            params={params}
            onChangeData={onChangeData}
            lockedParamIds={lockedParamIds}
            onChangeLockedParamIds={onChangeLockedParamIds}
            history={history}
            historyOffset={historyOffset}
            onUndo={onUndo}
            onRedo={onRedo}
            withAutoUpdate={withAutoUpdate}
            onChangeWithAutoUpdate={onChangeWithAutoUpdate}
            onClickRefresh={onClickRefresh}
            onLocalDataChange={onLocalDataChange}
            onSaveConfiguration={onSaveConfiguration}
            onOpenLoadConfigurationModal={onOpenLoadConfigurationModal}
            disableOpenLoadConfigurationButton={
              disableOpenLoadConfigurationButton
            }
            disableSaveConfigurationButton={disableSaveConfigurationButton}
          />
          <PanelFeatures features={features} />
        </div>
      </div>
      <PanelControls
        mode={mode}
        token={token}
        onSubmit={onSubmit}
        onOpenNewTab={onOpenNewTab}
        onClickBack={onClickBack}
        hideSubmit={hideSubmit}
      />
    </div>
  )
}
