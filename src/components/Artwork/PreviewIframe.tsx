import { forwardRef, useEffect, useState, useRef, useImperativeHandle } from 'react'
import style from './Artwork.module.scss'
import cs from "classnames"
import { LoaderBlock } from '../Layout/LoaderBlock'
import { Error } from '../Error/Error'

interface Props {
  url?: string
  textWaiting?: string
  onLoaded?: () => void
  hasLoading?: boolean
}

export interface ArtworkIframeRef {
  reloadIframe: () => void
  getHtmlIframe: () => HTMLIFrameElement | null
}

export const ArtworkIframe = forwardRef<ArtworkIframeRef, Props>(({ 
  url, 
  textWaiting, 
  onLoaded,
  hasLoading = true,
}, ref) => {
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<boolean>(false)
  const isLoaded = useRef<boolean>(false)
  const iframeRef = useRef<HTMLIFrameElement>(null)

  useEffect(() => {
    setLoading(!isLoaded.current)
    setError(false)
  }, [])

  const reloadIframe = () => {
    if (iframeRef.current) {
      setLoading(true)
      setError(false)
      iframeRef.current.src = iframeRef.current.src
    }
  }

  useEffect(() => {
    // when the url changes, we set reload to true
    setLoading(true)
  }, [url])

  // set iframe state to loaded and set ref to loaded to prevent loader init to loading
  const setIframeLoaded = () => {
    isLoaded.current = true
    setLoading(false)
  }

  const getHtmlIframe = (): HTMLIFrameElement|null => {
    return iframeRef.current
  }

  useImperativeHandle(ref, () => ({
    reloadIframe,
    getHtmlIframe
  }))

  return (
    <div className={cs(style["iframe-container"])}>
      <iframe
        ref={iframeRef}
        src={url}
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
    </div>
  );
})