import style from "./Card.module.scss"
import cs from "classnames"
import {
  PropsWithChildren,
  ReactNode,
  useContext,
  useState,
  useMemo,
} from "react"
import { SettingsContext } from "../../context/Theme"
import { GenTokLabel } from "../../types/entities/GenerativeToken"
import { getGenTokWarning } from "../../utils/generative-token"
import { Button } from "../Button"
import { MediaImage } from "../../types/entities/MediaImage"
import { Image } from "../Image"
import { WarningLayer } from "../Warning/WarningLayer"

interface Props {
  tokenLabels?: GenTokLabel[] | null
  image?: MediaImage
  thumbnailUri?: string | null
  undesirable?: boolean
  displayDetails?: boolean
  thumbInfosComp?: ReactNode
}

export function Card({
  tokenLabels,
  image,
  thumbnailUri,
  undesirable = false,
  displayDetails = true,
  thumbInfosComp,
  children,
}: PropsWithChildren<Props>) {
  const [error, setError] = useState<boolean>(false)
  const settings = useContext(SettingsContext)

  const warning = useMemo(() => {
    if (!tokenLabels || tokenLabels.length === 0) return false
    return getGenTokWarning(tokenLabels, settings, "preview")
  }, [settings, tokenLabels])

  return (
    <div
      className={cs(style.container, {
        [style.hover_effect]: settings.hoverEffectCard,
      })}
    >
      <div
        className={cs(style["thumbnail-container"], {
          [style.blur]: undesirable,
        })}
      >
        {!undesirable && (
          <Image
            ipfsUri={thumbnailUri!}
            image={image}
            alt=""
            onError={() => setError(true)}
            className={style.thumbnail}
            position="absolute"
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
        {!undesirable && warning && <WarningLayer warning={warning} />}
        {thumbInfosComp && (
          <div className={cs(style.thumbinfos)}>{thumbInfosComp}</div>
        )}
      </div>
      {displayDetails && <div className={cs(style.content)}>{children}</div>}
    </div>
  )
}
