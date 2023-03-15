import style from "./ArtworkFrame.module.scss"
import cs from "classnames"
import { PropsWithChildren, useContext, useMemo } from "react"
import { GenTokLabel } from "../../types/entities/GenerativeToken"
import { getGenTokWarning } from "../../utils/generative-token"
import { SettingsContext } from "../../context/Theme"
import { WarningLayer } from "../Warning/WarningLayer"

interface Props {
  tokenLabels?: GenTokLabel[] | null
  borderWidth?: number
}
export function ArtworkFrame({
  borderWidth = 10,
  children,
  tokenLabels,
}: PropsWithChildren<Props>) {
  const settings = useContext(SettingsContext)
  const warning = useMemo(() => {
    if (!tokenLabels || tokenLabels.length === 0) return false
    return getGenTokWarning(tokenLabels, settings, "preview")
  }, [settings, tokenLabels])
  return (
    <div className={cs(style.root)} style={{ borderWidth }}>
      {children}
      {warning && <WarningLayer className={style.warning} warning={warning} />}
    </div>
  )
}
