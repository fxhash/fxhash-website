import { forwardRef, useEffect, useState, useRef, useImperativeHandle } from 'react'
import style from './Artwork.module.scss'
import cs from "classnames"
import useAsyncEffect from "use-async-effect"
import { SandboxFiles } from '../../types/Sandbox'


interface Props {
  record?: SandboxFiles
  textWaiting?: string
  hash?: string
  onUrlUpdate?: (url: string) => void
}

export interface ArtworkIframeRef {
  reloadIframe: () => void
}

export const SandboxPreview = forwardRef<ArtworkIframeRef, Props>(({ 
  record, 
  hash, 
  onUrlUpdate,
  textWaiting 
}, ref) => {
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const workerReg = useRef<ServiceWorkerRegistration|null>(null)
  const [id, setId] = useState<string>("0")

  // register service workers
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("./sandbox/worker.js", {
        scope: "/sandbox"
      })
        .then(reg => {
          workerReg.current = reg
        })
        .catch(err => console.log(err))
    }
  }, [])

  useAsyncEffect(async () => {
    if (record && workerReg.current && workerReg.current.active) {
      const worker = workerReg.current
      const id = (Math.random()*1000000).toFixed(0)

      // send sandbox URL to worker
      worker.active!.postMessage({
        type: "REGISTER_REFERRER",
        data: {
          id: id,
          referrer: {
            base: `${location.origin}/sandbox/preview.html`,
            root: `${location.origin}/sandbox/`
          }
        }
      })

      // send the data to the service worker
      worker.active!.postMessage({
        type: "REGISTER_URLS",
        data: {
          id,
          record
        }
      })

      setId(id)
    }
  }, [record])

  // the URL of the iframe gets updated whenever ID / hash changes
  useEffect(() => {
    if (iframeRef.current && id !== "0") {
      const previewUrl = `${location.origin}/sandbox/preview.html?id=${id}&fxhash=${hash}`
      // load the sandbox preview into the iframe, then service workers do the job
      iframeRef.current.src = previewUrl
      onUrlUpdate && onUrlUpdate(previewUrl)
    }
  }, [id, hash])

  const reloadIframe = () => {
    if (iframeRef.current) {
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
          sandbox="allow-scripts allow-same-origin"
          className={cs(style.iframe)}
        />
        {/* {loading &&(
          <LoaderBlock height="100%">{textWaiting}</LoaderBlock>
        )} */}
      </div>
    </div>
  )
})