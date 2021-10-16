import { forwardRef, useEffect, useState, useRef, useImperativeHandle } from 'react'
import style from './Artwork.module.scss'
import cs from "classnames"
import useAsyncEffect from "use-async-effect"
import { fetchRetry } from '../../utils/network'
import { LoaderBlock } from '../Layout/LoaderBlock'
import { Error } from '../Error/Error'

interface Props {
  url?: string
  textWaiting?: string
}

export interface ArtworkIframeRef {
  reloadIframe: () => void
}

export const ArtworkIframe = forwardRef<ArtworkIframeRef, Props>(({ url, textWaiting }, ref) => {
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<boolean>(false)
  const iframeRef = useRef<HTMLIFrameElement>(null)

  useEffect(() => {
    setLoading(true)
    setError(false)
  }, [])

  const reloadIframe = () => {
    if (iframeRef.current) {
      setLoading(true)
      setError(false)
      iframeRef.current.src = iframeRef.current.src
    }
  }

  useImperativeHandle(ref, () => ({
    reloadIframe
  }))

  return (
    <div className={style.container}>
      <div className={cs(style['iframe-container'])}>
        <iframe 
          ref={iframeRef}
          src={url}
          sandbox="allow-scripts allow-same-origin"
          className={cs(style.iframe)}
          onLoad={() => setLoading(false)}
          onError={() => setError(true)}
        />
        {(loading && !error) &&(
          <LoaderBlock height="100%" className={cs(style.loader)}>{textWaiting}</LoaderBlock>
        )}
        {error && (
          <Error className={cs(style.error)}>
            Could not load the project
          </Error>
        )}
      </div>
    </div>
  )
})