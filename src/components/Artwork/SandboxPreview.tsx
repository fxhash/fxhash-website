import {
  forwardRef,
  useEffect,
  useState,
  useRef,
  useImperativeHandle,
} from "react"
import style from "./Artwork.module.scss"
import cs from "classnames"
import useAsyncEffect from "use-async-effect"
import { SandboxFiles } from "../../types/Sandbox"

interface Props {
  record?: SandboxFiles
  textWaiting?: string
  hash?: string
  fxparams?: string
  onLoaded?: () => void
  onUrlUpdate?: (url: string) => void
}

export interface ArtworkIframeRef {
  reloadIframe: () => void
  getHtmlIframe: () => HTMLIFrameElement | null
}

export const SandboxPreview = forwardRef<ArtworkIframeRef, Props>(
  ({ record, hash, onUrlUpdate, onLoaded, textWaiting, fxparams }, ref) => {
    const iframeRef = useRef<HTMLIFrameElement>(null)
    const workerReg = useRef<ServiceWorkerRegistration | null>(null)
    const [id, setId] = useState<string>("0")

    // register service workers
    useEffect(() => {
      if ("serviceWorker" in navigator) {
        navigator.serviceWorker
          .register("./sandbox/worker.js", {
            scope: "/sandbox",
          })
          .then((reg) => {
            workerReg.current = reg
          })
          .catch((err) => console.log(err))
      }
    }, [])

    useAsyncEffect(async () => {
      if (record && workerReg.current && workerReg.current.active) {
        const worker = workerReg.current
        const id = (Math.random() * 1000000).toFixed(0)

        // send sandbox URL to worker
        worker.active!.postMessage({
          type: "REGISTER_REFERRER",
          data: {
            id: id,
            referrer: {
              base: `${location.origin}/sandbox/preview.html`,
              root: `${location.origin}/sandbox/`,
            },
          },
        })

        // send the data to the service worker
        worker.active!.postMessage({
          type: "REGISTER_URLS",
          data: {
            id,
            record,
          },
        })

        setId(id)
      }
    }, [record])

    // the URL of the iframe gets updated whenever ID / hash changes
    useEffect(() => {
      if (iframeRef.current && id !== "0") {
        let previewUrl = `${location.origin}/sandbox/preview.html?id=${id}&fxhash=${hash}`
        if (fxparams) {
          previewUrl += `&fxparams=${fxparams}`
        }
        // load the sandbox preview into the iframe, then service workers do the job
        iframeRef.current.src = previewUrl
        onUrlUpdate && onUrlUpdate(previewUrl)
      }
    }, [id, hash, fxparams])

    const reloadIframe = () => {
      if (iframeRef.current) {
        iframeRef.current.src = iframeRef.current.src
      }
    }

    const getHtmlIframe = (): HTMLIFrameElement | null => {
      return iframeRef.current
    }

    useImperativeHandle(ref, () => ({
      reloadIframe,
      getHtmlIframe,
    }))

    return (
      <div className={cs(style["iframe-container"])}>
        <iframe
          ref={iframeRef}
          sandbox="allow-scripts allow-same-origin"
          className={cs(style.iframe)}
          onLoad={onLoaded}
        />
        {/* {loading &&(
        <LoaderBlock height="100%">{textWaiting}</LoaderBlock>
      )} */}
      </div>
    )
  }
)
SandboxPreview.displayName = "SandboxPreview"
