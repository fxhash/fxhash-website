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
  id: string
  setId: (id: string) => void
  record?: SandboxFiles
  textWaiting?: string
  onLoaded?: () => void
}

export interface ArtworkIframeRef {
  reloadIframe: () => void
  getHtmlIframe: () => HTMLIFrameElement | null
}

export const SandboxPreview = forwardRef<ArtworkIframeRef, Props>(
  ({ id, setId, record, onLoaded, textWaiting }, ref) => {
    const iframeRef = useRef<HTMLIFrameElement>(null)
    const workerReg = useRef<ServiceWorkerRegistration | null>(null)

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
