import style from "./Card.module.scss"
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
import { useClientAsyncEffect } from "../../utils/hookts"
import { Loader } from "../Utils/Loader"
import { useInView } from "react-intersection-observer"
import { SettingsContext } from "../../context/Theme"

interface Props {
  thumbnailUri?: string | null
  undesirable?: boolean
  displayDetails?: boolean
  thumbInfosComp?: ReactNode
}

export function Card({
  thumbnailUri,
  undesirable = false,
  displayDetails = true,
  thumbInfosComp,
  children,
}: PropsWithChildren<Props>) {
  const [loaded, setLoaded] = useState<string | null>(null)
  const [error, setError] = useState<boolean>(false)
  const url = useMemo(
    () => thumbnailUri && ipfsGatewayUrl(thumbnailUri),
    [thumbnailUri]
  )
  const { ref, inView } = useInView()
  const settings = useContext(SettingsContext)

  // lazy load the image
  useClientAsyncEffect(
    (isMounted) => {
      if (inView && !loaded && url && !error) {
        const img = new Image()
        img.onload = () => {
          if (isMounted()) {
            setLoaded(img.src)
          }
        }
        img.onerror = () => {
          // we fallback to the IPFS gateway
          // img.src = ipfsGatewayUrl(thumbnailUri)
          setError(true)
        }
        img.src = url
      }
    },
    [inView]
  )

  return (
    <div
      className={cs(style.container, {
        [style.hover_effect]: settings.hoverEffectCard,
      })}
      ref={ref}
    >
      <div
        className={cs(style["thumbnail-container"], {
          [style.undesirable]: undesirable,
          [effect.placeholder]: !loaded && !error,
        })}
        style={{
          backgroundImage: loaded ? `url(${loaded})` : "none",
        }}
      >
        {error && (
          <div className={cs(style.error)}>
            <i aria-hidden className="fa-solid fa-bug" />
            <span>could not load image</span>
          </div>
        )}
        {undesirable && (
          <div className={cs(style.flag)}>
            <i aria-hidden className="fas fa-exclamation-triangle" />
            <span>undesirable content</span>
          </div>
        )}
        {thumbInfosComp && (
          <div className={cs(style.thumbinfos)}>{thumbInfosComp}</div>
        )}
      </div>
      {displayDetails && <div className={cs(style.content)}>{children}</div>}
    </div>
  )
}
