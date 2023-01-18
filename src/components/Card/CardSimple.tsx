import React, { memo } from "react"
import { SquareContainer } from "../Layout/SquareContainer"
import { ArtworkFrame } from "../Artwork/ArtworkFrame"
import { Image } from "../Image"
import { GenerativeToken } from "../../types/entities/GenerativeToken"
import style from "./CardSimple.module.scss"
import { getGenerativeTokenUrl } from "../../utils/generative-token"
import Link from "next/link"
import { EntityBadge } from "../User/EntityBadge"
import cs from "classnames"

interface CardSimpleProps {
  className?: string
  generativeToken: GenerativeToken
}

const _CardSimple = ({ className, generativeToken }: CardSimpleProps) => {
  return (
    <div className={cs(className, style.container)}>
      <Link
        key={generativeToken.id}
        href={getGenerativeTokenUrl(generativeToken)}
      >
        <a className={style.url}>
          <SquareContainer>
            <ArtworkFrame tokenLabels={generativeToken.labels}>
              <Image
                image={generativeToken.captureMedia}
                ipfsUri={generativeToken.displayUri}
                alt={`${generativeToken.name} preview`}
                trueResolution
              />
            </ArtworkFrame>
          </SquareContainer>
          <p className={style.title}>{generativeToken.name}</p>
        </a>
      </Link>
      <div className={style.user}>
        <EntityBadge user={generativeToken.author} size="small" hasLink />
      </div>
    </div>
  )
}

export const CardSimple = memo(_CardSimple)
