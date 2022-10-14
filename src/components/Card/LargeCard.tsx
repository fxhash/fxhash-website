import style from "./LargeCard.module.scss"
import cs from "classnames"
import {
  PropsWithChildren,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react"
import { SettingsContext } from "../../context/Theme"
import { getGenTokWarning } from "../../utils/generative-token"
import { GenTokLabel } from "../../types/entities/GenerativeToken"
import { Button } from "../Button"
import { Image } from "../Image"
import { MediaImage } from "../../types/entities/MediaImage"

interface Props {
  tokenLabels?: GenTokLabel[] | null
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
  return (
    <div className={cs(style.root)}>
      {topper && <div className={cs(style.topper)}>{topper}</div>}
      <div
        className={cs(style.thumbnail_wrapper, {
          [style.blur]: undesirable,
        })}
      >
        {undesirable && (
          <div className={cs(style.flag)}>
            <i aria-hidden className="fas fa-exclamation-triangle" />
            <span>undesirable content</span>
          </div>
        )}
        <Image image={image} ipfsUri={thumbnailUri!} mode="responsive" alt="" />
      </div>
      {displayDetails && <div className={cs(style.content)}>{children}</div>}
    </div>
  )
}
