import {
  forwardRef,
  useEffect,
  useState,
  useRef,
  useImperativeHandle,
  useMemo,
  useContext,
} from "react"
import style from "./Artwork.module.scss"
import cs from "classnames"
import { LoaderBlock } from "../Layout/LoaderBlock"
import { Error } from "../Error/Error"
import { GenTokLabel } from "../../types/entities/GenerativeToken"
import { getGenTokWarning } from "../../utils/generative-token"
import { SettingsContext } from "../../context/Theme"
import { WarningLayer } from "../Warning/WarningLayer"

interface Props {
  tokenLabels?: GenTokLabel[] | null
  url?: string
  textWaiting?: string
  onLoaded?: () => void
  hasLoading?: boolean
}

export interface ArtworkIframeRef {
  reloadIframe: () => void
  getHtmlIframe: () => HTMLIFrameElement | null
}

export const ArtworkIframe = forwardRef<ArtworkIframeRef, Props>(
  ({ tokenLabels, url, textWaiting, onLoaded, hasLoading = true }, ref) => {
    const settings = useContext(SettingsContext)
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<boolean>(false)
    const isLoaded = useRef<boolean>(false)
    const iframeRef = useRef<HTMLIFrameElement>(null)

    useEffect(() => {
      setLoading(!isLoaded.current)
      setError(false)
    }, [])

    const reloadIframe = () => {
      if (url && iframeRef?.current?.contentWindow) {
        setLoading(true)
        setError(false)
        iframeRef.current.contentWindow.location.replace(url)
      }
    }

    useEffect(() => {
      // when the url changes, we set reload to true
      setLoading(true)
      if (url && iframeRef?.current?.contentWindow) {
        // keep iframe history hidden
        iframeRef.current.contentWindow.location.replace(url)
      }
    }, [url, iframeRef])

    // set iframe state to loaded and set ref to loaded to prevent loader init to loading
    const setIframeLoaded = () => {
      isLoaded.current = true
      setLoading(false)
    }

    const getHtmlIframe = (): HTMLIFrameElement | null => {
      return iframeRef.current
    }

    useImperativeHandle(ref, () => ({
      reloadIframe,
      getHtmlIframe,
    }))

    const warning = useMemo(() => {
      if (!tokenLabels || tokenLabels.length === 0) return false
      return getGenTokWarning(tokenLabels, settings, "run")
    }, [settings, tokenLabels])
    return (
      <div className={cs(style["iframe-container"])}>
        <iframe
          ref={iframeRef}
          sandbox="allow-scripts allow-same-origin"
          className={cs(style.iframe)}
          onLoad={() => {
            onLoaded?.()
            setIframeLoaded()
          }}
          onError={() => setError(true)}
          allow="accelerometer; camera; gyroscope; microphone; xr-spatial-tracking;"
        />
        {loading && hasLoading && !error && (
          <LoaderBlock height="100%" color="white" className={cs(style.loader)}>
            {textWaiting}
          </LoaderBlock>
        )}
        {error && (
          <Error className={cs(style.error)}>Could not load the project</Error>
        )}
        {warning && (
          <WarningLayer warning={warning} className={style.warning} />
        )}
      </div>
    )
  }
)
ArtworkIframe.displayName = "ArtworkIframe"
