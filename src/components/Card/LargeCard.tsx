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
import { Image } from "../Image"
import { MediaImage } from "../../types/entities/MediaImage"

interface Props {
  image?: MediaImage
  thumbnailUri?: string | null
  undesirable?: boolean
  displayDetails?: boolean
  topper?: ReactNode
}

export function LargeCard({
  thumbnailUri,
  image,
  undesirable = false,
  displayDetails = true,
  topper,
  children,
}: PropsWithChildren<Props>) {
  const [loaded, setLoaded] = useState<boolean>(false)
  const { ref, inView } = useInView()

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
        <Image
          ipfsUri={thumbnailUri!}
          image={image}
          alt=""
          onLoadingComplete={() => setLoaded(true)}
        />
      </div>
      {displayDetails && <div className={cs(style.content)}>{children}</div>}
    </div>
  )
}
