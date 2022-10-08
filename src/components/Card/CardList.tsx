import style from "./CardList.module.scss"
import cs from "classnames"
import effect from "../../styles/Effects.module.scss"
import { PropsWithChildren, useMemo, useState } from "react"
import { ipfsGatewayUrl } from "../../services/Ipfs"
import { useClientAsyncEffect } from "../../utils/hookts"
import { useInView } from "react-intersection-observer"
import { Image } from "../Image"
import { MediaImage } from "../../types/entities/MediaImage"

interface Props {
  image?: MediaImage
  thumbnailUri: string | null | undefined
  undesirable?: boolean
}

export function CardList({
  image,
  thumbnailUri,
  undesirable = false,
  children,
}: PropsWithChildren<Props>) {
  const [loaded, setLoaded] = useState<boolean>(false)
  const [error, setError] = useState<boolean>(false)
  return (
    <div className={cs(style.container)}>
      <div
        className={cs(style["thumbnail-container"], {
          [style.undesirable]: undesirable,
          [effect.placeholder]: !loaded,
        })}
      >
        {!undesirable && (
          <Image
            ipfsUri={thumbnailUri!}
            image={image}
            alt=""
            onLoadingComplete={() => setLoaded(true)}
            onError={() => setError(true)}
          />
        )}
        {error && (
          <div className={cs(style.error)}>
            <i aria-hidden className="fas fa-exclamation-circle" />
            <span>could not load image</span>
          </div>
        )}
        {undesirable && (
          <div className={cs(style.flag)}>
            <i aria-hidden className="fas fa-exclamation-triangle" />
            <span>undesirable content</span>
          </div>
        )}
      </div>
      <div className={cs(style.content)}>{children}</div>
    </div>
  )
}
