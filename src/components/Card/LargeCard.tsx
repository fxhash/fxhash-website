import style from "./LargeCard.module.scss"
import effect from "../../styles/Effects.module.scss"
import cs from "classnames"
import {
  PropsWithChildren,
  ReactNode,
  useContext,
  useMemo,
  useState,
} from "react"
import { ipfsGatewayUrl } from "../../services/Ipfs"
import { useInView } from "react-intersection-observer"
import { SettingsContext } from "../../context/Theme"
import { useClientAsyncEffect } from "../../utils/hookts"

interface Props {
  thumbnailUri?: string | null
  undesirable?: boolean
  displayDetails?: boolean
  topper?: ReactNode
}

export function LargeCard({
  thumbnailUri,
  undesirable = false,
  displayDetails = true,
  topper,
  children,
}: PropsWithChildren<Props>) {
  const [loaded, setLoaded] = useState<string | null>(null)
  const url = useMemo(() => thumbnailUri && ipfsGatewayUrl(thumbnailUri), [])
  const { ref, inView } = useInView()
  const settings = useContext(SettingsContext)

  // lazy load the image
  useClientAsyncEffect(
    (isMounted) => {
      if (inView && !loaded && url) {
        const img = new Image()
        img.onload = () => {
          if (isMounted()) {
            setLoaded(img.src)
          }
        }
        img.src = url
      }
    },
    [inView]
  )

  return (
    <div className={cs(style.root)} ref={ref}>
      {topper && <div className={cs(style.topper)}>{topper}</div>}
      <div
        className={cs(style.thumbnail_wrapper, {
          [style.undesirable]: undesirable,
          [effect.placeholder]: !loaded,
          [style.loaded]: loaded,
        })}
      >
        {undesirable && (
          <div className={cs(style.flag)}>
            <i aria-hidden className="fas fa-exclamation-triangle" />
            <span>undesirable content</span>
          </div>
        )}
        {loaded && url && <img src={url} alt="preview" />}
      </div>
      {displayDetails && <div className={cs(style.content)}>{children}</div>}
    </div>
  )
}
