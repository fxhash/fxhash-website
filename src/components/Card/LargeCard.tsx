import style from "./LargeCard.module.scss"
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
import { useInView } from "react-intersection-observer"
import { SettingsContext } from "../../context/Theme"
import { useClientAsyncEffect } from "../../utils/hookts"
import { getGenTokWarning } from "../../utils/generative-token"
import { GenTokLabel } from "../../types/entities/GenerativeToken"
import { Button } from "../Button";

interface Props {
  tokenLabels?: GenTokLabel[] | null
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
  tokenLabels,
}: PropsWithChildren<Props>) {
  const [loaded, setLoaded] = useState<string | null>(null)
  const url = useMemo(() => thumbnailUri && ipfsGatewayUrl(thumbnailUri), [])
  const { ref, inView } = useInView()
  const [showWarning, setShowWarning] = useState(true)
  const settings = useContext(SettingsContext)
  const handleClickShow = useCallback((e) => {
    e.stopPropagation()
    e.preventDefault()
    setShowWarning(false)
  }, [])
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

  const warning = useMemo(() => {
    if (!tokenLabels || tokenLabels.length === 0) return false
    return getGenTokWarning(tokenLabels, settings)
  }, [settings, tokenLabels])

  return (
    <div className={cs(style.root)} ref={ref}>
      {topper && <div className={cs(style.topper)}>{topper}</div>}
      <div
        className={cs(style.thumbnail_wrapper, {
          [style.blur]: undesirable || (warning && showWarning),
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
        {!undesirable && warning && showWarning && (
          <div className={cs(style.warning)}>
            <div>
              {warning.icons.map((iconClassName) => (
                <i key={iconClassName} aria-hidden className={iconClassName} />
              ))}
            </div>
            <span>{warning.labels.join(", ")} warning:</span>
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
        {loaded && url && <img src={url} alt="preview" />}
      </div>
      {displayDetails && <div className={cs(style.content)}>{children}</div>}
    </div>
  )
}
