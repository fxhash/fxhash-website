import style from "./Card.module.scss"
import effect from "../../styles/Effects.module.scss"
import cs from "classnames"
import {
  PropsWithChildren,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react"
import { ipfsGatewayUrl } from "../../services/Ipfs"
import { useClientAsyncEffect } from "../../utils/hookts"
import { useInView } from "react-intersection-observer"
import { SettingsContext } from "../../context/Theme"
import { GenTokLabel } from "../../types/entities/GenerativeToken"
import { getGenTokWarning } from "../../utils/generative-token"
import { Button } from "../Button"

interface Props {
  tokenLabels?: GenTokLabel[] | null
  thumbnailUri?: string | null
  undesirable?: boolean
  displayDetails?: boolean
  thumbInfosComp?: ReactNode
}

export function Card({
  tokenLabels,
  thumbnailUri,
  undesirable = false,
  displayDetails = true,
  thumbInfosComp,
  children,
}: PropsWithChildren<Props>) {
  const [showWarning, setShowWarning] = useState(true)
  const [loaded, setLoaded] = useState<string | null>(null)
  const [error, setError] = useState<boolean>(false)
  const url = useMemo(
    () => thumbnailUri && ipfsGatewayUrl(thumbnailUri),
    [thumbnailUri]
  )
  const { ref, inView } = useInView()
  const settings = useContext(SettingsContext)
  const handleClickShow = useCallback((e) => {
    e.stopPropagation()
    e.preventDefault()
    setShowWarning(false)
  }, [])

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

  const warning = useMemo(() => {
    if (!tokenLabels || tokenLabels.length === 0) return false
    return getGenTokWarning(tokenLabels, settings)
  }, [settings, tokenLabels])
  return (
    <div
      className={cs(style.container, {
        [style.hover_effect]: settings.hoverEffectCard,
      })}
      ref={ref}
    >
      <div
        className={cs(style["thumbnail-container"], {
          [style.blur]: undesirable || (warning && showWarning),
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
        {!undesirable && warning && showWarning && (
          <div className={cs(style.warning)}>
            <div>
              {warning.icons.map((iconClassName) => (
                <i key={iconClassName} aria-hidden className={iconClassName} />
              ))}
            </div>
            <span>{warning.labels.join(", ")} warning:</span>
            {warning.descriptions.length > 1 ? (
              <ul className={style.description}>
                {warning.descriptions.map((description) => (
                  <li key={description}>{description}</li>
                ))}
              </ul>
            ) : (
              <div className={style.description}>{warning.descriptions[0]}</div>
            )}
            <Button
              className={style.show_button}
              size="very-small"
              type="button"
              onClick={handleClickShow}
            >
              show
            </Button>
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
