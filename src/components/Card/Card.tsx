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
import { MediaImage } from "../../types/entities/MediaImage"
import { Image } from "../Image"

interface Props {
  image?: MediaImage
  thumbnailUri?: string | null
  undesirable?: boolean
  displayDetails?: boolean
  thumbInfosComp?: ReactNode
}

export function Card({
  image,
  thumbnailUri,
  undesirable = false,
  displayDetails = true,
  thumbInfosComp,
  children,
}: PropsWithChildren<Props>) {
  const [loaded, setLoaded] = useState<boolean>(false)
  const [error, setError] = useState<boolean>(false)
  const settings = useContext(SettingsContext)

  return (
    <div
      className={cs(style.container, {
        [style.hover_effect]: settings.hoverEffectCard,
      })}
    >
      <div
        className={cs(style["thumbnail-container"], {
          [style.undesirable]: undesirable,
          [effect.placeholder]: !loaded && !error,
        })}
      >
        {!undesirable && (
          <Image
            ipfsUri={thumbnailUri!}
            image={image}
            alt=""
            layout="fill"
            objectFit="contain"
            onLoadingComplete={() => setLoaded(true)}
            onError={() => setError(true)}
          />
        )}
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
