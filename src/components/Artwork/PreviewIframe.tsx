import { forwardRef, useEffect, useState, useRef, useImperativeHandle } from 'react'
import style from './Artwork.module.scss'
import cs from "classnames"
import useAsyncEffect from "use-async-effect"
import { fetchRetry } from '../../utils/network'
import { LoaderBlock } from '../Layout/LoaderBlock'

interface Props {
  url?: string
  textWaiting?: string
}

export interface ArtworkIframeRef {
  reloadIframe: () => void
}

export const ArtworkIframe = forwardRef<ArtworkIframeRef, Props>(({ url, textWaiting }, ref) => {
  const [urlReady, setUrlReady] = useState<string|null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<boolean>(false)
  // to know when to cancel a fetch, keeps track of the index of the current fetch
  const fetchIndex = useRef<number>(0)
  const iframeRef = useRef<HTMLIFrameElement>(null)

  const reloadIframe = () => {
    if (iframeRef.current) {
      iframeRef.current.src = iframeRef.current.src
    }
  }

  useImperativeHandle(ref, () => ({
    reloadIframe
  }))

  // to avoid displaying 404 errors, the component does some periodic fetches until it can reach the URL
  // it can be usefull if Git for instance is not up-to-date
  useAsyncEffect(async (isMounted) => {
    if (url) {
      const index = ++fetchIndex.current
      const fUrl = url

      if (isMounted()) {
        setUrlReady(null)
        setLoading(true)
        setError(false)
      }

      try {
        await fetchRetry(fUrl, 20, 5000, () => !isMounted() || fetchIndex.current !== index)
        if (isMounted() && fetchIndex.current === index) {
          setLoading(false)
          setUrlReady(fUrl)
          setError(false)
        }
      }
      catch(e) {
        if (isMounted()) {
          setError(true)
          setLoading(false)
        }
      }
    }
  }, [url])

  return (
    <div className={style.container}>
      <div className={cs(style['iframe-container'])}>
        {urlReady && (
          <iframe 
            ref={iframeRef}
            src={urlReady}
            sandbox="allow-scripts allow-same-origin"
            className={cs(style.iframe)}
          />
        )}
        {loading &&(
          <LoaderBlock height="100%">{textWaiting}</LoaderBlock>
        )}
      </div>
    </div>
  )
})