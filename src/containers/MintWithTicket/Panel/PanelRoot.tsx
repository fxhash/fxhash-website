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
import { MutableRefObject, RefObject } from "react"
import { PanelControls } from "./PanelControls"
import { withAutoFormat } from "components/NFTArticle/SlateEditor/Plugins/AutoFormatPlugin"

interface Props {
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
  onClickSubmit: () => void
}

export function PanelRoot(props: Props) {
  const {
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
  } = props
  return (
    <div className={cs(style.root)}>
      <div className={cs(style.scrollWrapper)}>
        <PanelHeader title={token.name} description={` `} />

        <div className={cs(style.body)}>
          <PanelHash hash={hash} onChangeHash={onChangeHash} />
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
          />
          <PanelFeatures features={features} />
        </div>
      </div>
      <PanelControls
        onSubmit={onClickSubmit}
        onOpenNewTab={onOpenNewTab}
        withAutoUpdate={withAutoUpdate}
        onChangeWithAutoUpdate={onChangeWithAutoUpdate}
        onClickBack={onClickBack}
      />
    </div>
  )
}
