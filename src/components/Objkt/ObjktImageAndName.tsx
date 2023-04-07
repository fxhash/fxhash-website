import React, { memo } from "react"
import style from "./ObjktImageAndName.module.scss"
import { Objkt } from "../../types/entities/Objkt"
import Link from "next/link"
import { Image } from "../Image"

interface Props {
  objkt: Objkt
  shortName?: boolean
  size?: number
}

const _ObjtkImageAndName = ({ objkt, shortName, size = 40 }: Props) => {
  return (
    <Link href={`/gentk/${objkt.id}`}>
      <a className={style.container}>
        <div className={style.thumbnail_container}>
          <Image
            ipfsUri={objkt.metadata?.thumbnailUri}
            image={objkt.captureMedia}
            alt={`thumbnail of ${objkt.name}`}
          />
        </div>
        <span className={style.container_name}>
          <span className={style.label}>Gentk</span>
          <span className={style.name}>
            {shortName ? `#${objkt.iteration}` : objkt.name}
          </span>
        </span>
      </a>
    </Link>
  )
}

export const ObjktImageAndName = memo(_ObjtkImageAndName)
