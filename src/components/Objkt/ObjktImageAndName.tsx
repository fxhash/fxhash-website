import React, { memo } from "react"
import style from "./ObjktImageAndName.module.scss"
import { Objkt } from "../../types/entities/Objkt"
import Link from "next/link"
import { Image } from "../Image"
import { MediaImage } from "types/entities/MediaImage"
import { GenerativeToken } from "types/entities/GenerativeToken"

interface TokenImageAndNameProps {
  href: string
  metadata?: {
    thumbnailUri: string
  }
  captureMedia?: MediaImage
  label: string
  name?: string
}

const _TokenImageAndName = ({
  href,
  metadata,
  captureMedia,
  label,
  name,
}: TokenImageAndNameProps) => (
  <Link href={href}>
    <a className={style.container}>
      <div className={style.thumbnail_container}>
        <Image
          ipfsUri={metadata?.thumbnailUri}
          image={captureMedia}
          alt={`thumbnail of ${name}`}
        />
      </div>
      <span className={style.container_name}>
        <span className={style.label}>{label}</span>
        <span className={style.name}>{name}</span>
      </span>
    </a>
  </Link>
)

interface ObjktImageAndNameProps {
  objkt: Objkt
  label?: string
  shortName?: boolean
  size?: number
}

const _ObjtkImageAndName = ({
  objkt,
  shortName,
  size = 40,
}: ObjktImageAndNameProps) => {
  return (
    <TokenImageAndName
      href={`/gentk/${objkt.id}`}
      metadata={objkt.metadata}
      captureMedia={objkt.captureMedia}
      label="Gentk"
      name={shortName ? `#${objkt.iteration}` : objkt.name}
    />
  )
}

interface GenerativeTokenImageAndNameProps {
  token: GenerativeToken
  label?: string
  shortName?: boolean
  size?: number
}

const _GenerativeTokenImageAndName = ({
  token,
  shortName,
}: GenerativeTokenImageAndNameProps) => (
  <TokenImageAndName
    href={`/generative/${token.id}`}
    metadata={token.metadata}
    captureMedia={token.captureMedia}
    name={shortName ? `Collection` : `${token.name} (collection)`}
    label="Token"
  />
)

export const TokenImageAndName = memo(_TokenImageAndName)
export const ObjktImageAndName = memo(_ObjtkImageAndName)
export const GenerativeTokenImageAndName = memo(_GenerativeTokenImageAndName)
