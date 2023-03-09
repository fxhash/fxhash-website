import style from "./MintWithTicketPage.module.scss"
import cs from "classnames"
import { GenerativeToken } from "types/entities/GenerativeToken"
import {
  ArtworkIframe,
  ArtworkIframeRef,
} from "components/Artwork/PreviewIframe"
import { ipfsUrlWithHashAndParams } from "../../utils/ipfs"
import { useContext, useEffect, useMemo, useRef, useState } from "react"
import {
  deserializeParams,
  serializeParams,
  stringifyParamsData,
} from "components/FxParams/utils"
import { useReceiveTokenInfos } from "hooks/useReceiveTokenInfos"
import { PanelRoot } from "./Panel/PanelRoot"
import { generateFxHash } from "utils/hash"
import {
  ParamsHistoryContext,
  ParamsHistoryProvider,
} from "components/FxParams/ParamsHistory"
import { PanelParamsRef } from "./Panel/PanelParams"
import { useRouter } from "next/router"

interface Props {
  token: GenerativeToken
}
export function MintWithTicketPageRoot({ token }: Props) {
  const panelParamsRef = useRef<PanelParamsRef>(null)
  const historyContext = useContext(ParamsHistoryContext)
  const artworkIframeRef = useRef<ArtworkIframeRef>(null)
  const lastHistoryActionData = useRef<any>()
  const router = useRouter()
  const [withAutoUpdate, setWithAutoUpdate] = useState<boolean>(false)
  const [lockedParamIds, setLockedParamIds] = useState<string[]>([])
  const [hash, setHash] = useState(
    token.metadata.previewHash || generateFxHash()
  )
  const [data, setData] = useState({})
  const { params, features, onIframeLoaded } =
    useReceiveTokenInfos(artworkIframeRef)

  const inputBytes = useMemo<string | null>(() => {
    const serialized = serializeParams(data, params || [])
    if (serialized.length === 0)
      return token.metadata?.previewInputBytes || null
    return serialized
  }, [stringifyParamsData(data), params])

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

  // TODO: Call contract v3 mint with ticket
  const handleClickSubmit = () => {}

  useEffect(() => {
    historyContext.registerAction("params-update", (value: any) => {
      console.log(value)
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

  return (
    <div className={cs(style.root)}>
      <div className={cs(style.panel)}>
        <PanelRoot
          data={data}
          params={params}
          features={features}
          hash={hash}
          token={token}
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
        />
      </div>
      <div className={cs(style.frame)}>
        <ArtworkIframe
          ref={artworkIframeRef}
          url={url}
          onLoaded={onIframeLoaded}
        />
      </div>
    </div>
  )
}

export function MintWithTicketPage(props: Props) {
  return (
    <ParamsHistoryProvider>
      <MintWithTicketPageRoot token={props.token} />
    </ParamsHistoryProvider>
  )
}
