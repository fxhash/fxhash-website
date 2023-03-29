import style from "./PanelRoot.module.scss"
import cs from "classnames"
import { PanelHeader } from "./PanelHeader"
import { PanelParams, PanelParamsRef } from "./PanelParams"
import { PanelFeatures } from "./PanelFeatures"
import { PanelHash } from "./PanelHash"
import {
  FxParamDefinition,
  FxParamsData,
  FxParamType,
} from "components/FxParams/types"
import { GenerativeToken } from "types/entities/GenerativeToken"
import { IParamsHistoryEntry } from "components/FxParams/ParamsHistory"
import { RefObject, useMemo } from "react"
import { getUserName } from "utils/user"
import { PanelControls } from "./PanelControls"
import { Spacing } from "components/Layout/Spacing"
import { TOnMintHandler } from "../MintWithTicketPage"
import Link from "next/link"

export type PanelSubmitMode = "with-ticket" | "free" | "none"

interface Props {
  show: boolean
  data: Record<string, any>
  hash: string
  features: any
  params: FxParamDefinition<FxParamType>[]
  token: GenerativeToken
  onChangeHash: (s: string) => void
  onChangeData: (data: FxParamsData) => void
  onChangeLockedParamIds?: (ids: string[]) => void
  lockedParamIds?: string[]
  history?: IParamsHistoryEntry[]
  historyOffset?: number
  onUndo?: () => void
  onRedo?: () => void
  panelParamsRef?: RefObject<PanelParamsRef>
  withAutoUpdate: boolean
  onChangeWithAutoUpdate: (state: boolean) => void
  onOpenNewTab: () => void
  onClickBack: () => void
  onClickSubmit: TOnMintHandler
  onClickHide: () => void
  onClickRefresh?: () => void
  onLocalDataChange?: (d: FxParamsData) => void
  hideSubmit?: boolean
  mode?: PanelSubmitMode
  disableWarningAnimation?: boolean
}

export function PanelRoot(props: Props) {
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
    onClickSubmit,
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
          />
          <PanelFeatures features={features} />
        </div>
      </div>
      <PanelControls
        mode={mode}
        token={token}
        onSubmit={onClickSubmit}
        onOpenNewTab={onOpenNewTab}
        onClickBack={onClickBack}
        hideSubmit={hideSubmit}
      />
    </div>
  )
}
