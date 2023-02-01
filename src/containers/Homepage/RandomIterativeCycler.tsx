import React, { memo, useEffect, useState } from "react"
import { GenerativeToken } from "../../types/entities/GenerativeToken"
import { SquareContainer } from "../../components/Layout/SquareContainer"
import { ArtworkFrame } from "../../components/Artwork/ArtworkFrame"
import { Image } from "../../components/Image"
import { EntityBadge } from "../../components/User/EntityBadge"
import { UserBadge } from "../../components/User/UserBadge"
import style from "./RandomIterativeCycler.module.scss"
import cs from "classnames"
import Link from "next/link"

interface RandomIterativeCyclerProps {
  generativeToken: GenerativeToken
  onChangeCursor: (cursorPos: number) => void
}

const _RandomIterativeCycler = ({
  generativeToken,
  onChangeCursor,
}: RandomIterativeCyclerProps) => {
  const [cursor, setCursor] = useState(0)
  useEffect(() => {
    setInterval(() => {
      setCursor((oldCursor) => {
        const newCursor =
          oldCursor === generativeToken.objkts.length - 1 ? 0 : oldCursor + 1
        onChangeCursor(newCursor)
        return newCursor
      })
    }, 4000)
  }, [generativeToken.objkts.length, onChangeCursor])
  return (
    <div className={style.cycler}>
      {generativeToken.objkts?.map((objkt, idx) => {
        const divStyle = {
          transform: `translateX(calc(${idx - cursor} * (100% + 16px)))`,
        }
        return (
          <div
            key={objkt.slug}
            style={divStyle}
            className={cs({
              [style.is_active]: idx === cursor,
            })}
          >
            <SquareContainer>
              <ArtworkFrame tokenLabels={generativeToken.labels}>
                <Image
                  image={objkt.captureMedia}
                  ipfsUri={objkt.metadata?.thumbnailUri}
                  alt={`${objkt.name} preview`}
                />
              </ArtworkFrame>
            </SquareContainer>
            <div className={style.details}>
              <Link href={`/gentk/slug/${objkt.slug}`}>
                <a className={style.title_url}>
                  <h4>
                    {generativeToken.name}{" "}
                    <span className={style.iteration}>#{objkt.iteration}</span>
                  </h4>
                </a>
              </Link>
              <div className={style.users}>
                <div>
                  <EntityBadge
                    classNameAvatar={style.avatar}
                    topText="created by"
                    user={generativeToken.author}
                    toggeable
                    centered
                    size="regular"
                  />
                </div>
                <div>
                  {objkt.owner && (
                    <UserBadge
                      classNameAvatar={style.avatar}
                      topText="owned by"
                      user={objkt.owner}
                      size="regular"
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export const RandomIterativeCycler = memo(_RandomIterativeCycler)
