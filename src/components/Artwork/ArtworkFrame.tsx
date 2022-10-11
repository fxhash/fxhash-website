import style from "./ArtworkFrame.module.scss"
import cs from "classnames"
import {
  PropsWithChildren,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react"
import { GenTokLabel } from "../../types/entities/GenerativeToken"
import { getGenTokWarning } from "../../utils/generative-token"
import { SettingsContext } from "../../context/Theme"
import { Button } from "../Button"

interface Props {
  tokenLabels?: GenTokLabel[] | null
  borderWidth?: number
}
export function ArtworkFrame({
  borderWidth = 10,
  children,
  tokenLabels,
}: PropsWithChildren<Props>) {
  const [showWarning, setShowWarning] = useState(true)
  const settings = useContext(SettingsContext)
  const handleClickShow = useCallback((e) => {
    e.stopPropagation()
    e.preventDefault()
    setShowWarning(false)
  }, [])
  const warning = useMemo(() => {
    if (!tokenLabels || tokenLabels.length === 0) return false
    return getGenTokWarning(tokenLabels, settings)
  }, [settings, tokenLabels])
  return (
    <div
      className={cs(style.root, {
        [style.blur]: warning && showWarning,
      })}
      style={{ borderWidth }}
    >
      {children}
      {warning && showWarning && (
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
            size="small"
            type="button"
            onClick={handleClickShow}
          >
            show
          </Button>
        </div>
      )}
    </div>
  )
}
