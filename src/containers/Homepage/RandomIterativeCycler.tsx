import React, { memo, useEffect, useRef, useState } from "react"
import { GenerativeToken } from "../../types/entities/GenerativeToken"
import { SquareContainer } from "../../components/Layout/SquareContainer"
import { ArtworkFrame } from "../../components/Artwork/ArtworkFrame"
import { Image } from "../../components/Image"
import { EntityBadge } from "../../components/User/EntityBadge"
import { UserBadge } from "../../components/User/UserBadge"
import style from "./RandomIterativeCycler.module.scss"
import cs from "classnames"
import Link from "next/link"
import {
  ProgressAnimated,
  ProgressAnimatedRef,
} from "../../components/Utils/ProgressAnimated"
import { ManualProgressAnimated } from "../../components/Utils/ManualProgressAnimated"

interface RandomIterativeCyclerProps {
  generativeToken: GenerativeToken
  onChangeCursor: (cursorPos: number) => void
}

const maxTimeSec = 5
const _RandomIterativeCycler = ({
  generativeToken,
  onChangeCursor,
}: RandomIterativeCyclerProps) => {
  const [cursor, setCursor] = useState(0)
  const [counterInSec, setCounterInSec] = useState(0)
  useEffect(() => {
    setInterval(() => {
      setCounterInSec((sec) => sec + 1)
    }, 1000)
  }, [])
  useEffect(() => {
    if (counterInSec > maxTimeSec) {
      setCursor((oldCursor) => {
        const newCursor =
          oldCursor === generativeToken.objkts.length - 1 ? 0 : oldCursor + 1
        onChangeCursor(newCursor)
        return newCursor
      })
      setCounterInSec(0)
    }
  }, [counterInSec, generativeToken.objkts.length, onChangeCursor])
  return (
    <div className={style.cycler}>
      {generativeToken.objkts?.map((objkt, idx) => {
        const divStyle = {
          transform: `translateX(calc(${idx - cursor} * (75%)))`,
        }
        const isActive = idx === cursor
        return (
          <div
            key={objkt.slug}
            style={divStyle}
            className={cs({
              [style.show]: idx === cursor - 1 || idx === cursor + 1,
              [style.is_active]: isActive,
            })}
          >
            <div
              className={cs({
                [style.square]: isActive,
              })}
            >
              <SquareContainer className={cs(style.square_container)}>
                <ArtworkFrame
                  tokenLabels={generativeToken.labels}
                  borderWidth={0}
                >
                  <Image
                    image={objkt.captureMedia}
                    ipfsUri={objkt.metadata?.thumbnailUri}
                    alt={`${objkt.name} preview`}
                  />
                </ArtworkFrame>
              </SquareContainer>
              <div className={style.details}>
                {isActive && (
                  <ManualProgressAnimated
                    percent={(counterInSec * 100) / maxTimeSec}
                    className={style.progress_bar}
                  />
                )}
                <div className={style.infos}>
                  <UserBadge
                    classNameAvatar={style.avatar}
                    user={generativeToken.author}
                    displayName={false}
                  />
                  <div>
                    <Link href={`/gentk/slug/${objkt.slug}`}>
                      <a className={style.title_url}>
                        <h4>
                          {generativeToken.name}{" "}
                          <span className={style.iteration}>
                            #{objkt.iteration}/{generativeToken.supply}
                          </span>
                        </h4>
                      </a>
                    </Link>
                    <div className={style.creator}>
                      <EntityBadge
                        displayAvatar={false}
                        user={generativeToken.author}
                        toggeable
                        centered
                        size="regular"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {objkt.owner && (
              <div className={style.owner}>
                <span className={style.label}>owned by</span>
                <UserBadge
                  displayAvatar={false}
                  classNameAvatar={style.avatar}
                  user={objkt.owner}
                  size="regular"
                />
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

export const RandomIterativeCycler = memo(_RandomIterativeCycler)
