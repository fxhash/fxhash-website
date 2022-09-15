import style from "./RevealIframe.module.scss"
import effects from "../../styles/Effects.module.scss"
import cs from "classnames"
import { forwardRef, useState, useEffect } from "react"
import { ClientOnlyEmpty } from "../Utils/ClientOnly"
import { LoaderBlock } from "../Layout/LoaderBlock"

interface Props {
  url?: string
  onLoaded?: () => void
  resetOnUrlChange?: boolean
}
export const RevealIframe = forwardRef<HTMLIFrameElement, Props>(
  ({ url, onLoaded, resetOnUrlChange = false }, ref) => {
    const [loaded, setLoaded] = useState(false)

    useEffect(() => {
      if (resetOnUrlChange) {
        setLoaded(false)
      }
    }, [resetOnUrlChange, url])

    const isLoaded = () => {
      setTimeout(() => {
        setLoaded(true)
        onLoaded?.()
      }, 500)
    }

    return (
      <div className={cs(style.container)}>
        <div
          className={cs(style.iframe_container, effects["drop-shadow-big"], {
            [style.loaded]: loaded,
          })}
        >
          <ClientOnlyEmpty>
            <iframe
              ref={ref}
              sandbox="allow-scripts allow-same-origin"
              onLoad={() => isLoaded()}
              // onReset
              src={url}
            />
          </ClientOnlyEmpty>
          <LoaderBlock height="100%" className={cs(style.loader)} color="white">
            .loading token.
          </LoaderBlock>
        </div>
      </div>
    )
  }
)
RevealIframe.displayName = "RevealIframe"
