import React, { memo, useCallback, useEffect, useMemo, useState } from "react"
import { GenerativeToken } from "../../types/entities/GenerativeToken"
import { SquareContainer } from "../../components/Layout/SquareContainer"
import { ArtworkFrame } from "../../components/Artwork/ArtworkFrame"
import { Image } from "../../components/Image"
import { EntityBadge } from "../../components/User/EntityBadge"
import { UserBadge } from "../../components/User/UserBadge"
import style from "./RandomIterativeCycler.module.scss"
import cs from "classnames"
import Link from "next/link"
import { ManualProgressAnimated } from "../../components/Utils/ManualProgressAnimated"

type CalculateItemPositionAndOpacityPayload = {
  isActive: boolean
  show: boolean
  divStyle: object
}
type CalculateItemPositionAndOpacity = (data: {
  idx: number
  cursor: number
  totalItems: number
}) => CalculateItemPositionAndOpacityPayload

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
  const calculateItemPositionAndOpacity =
    useCallback<CalculateItemPositionAndOpacity>(
      ({ idx, cursor, totalItems }) => {
        if (totalItems === 1)
          return { isActive: true, show: true, divStyle: {} }
        const isCursorAfterLoopStart = cursor + 1 >= totalItems
        const isCursorBeforeLoopEnd = cursor - 1 < 0
        const isBeforeActive = isCursorBeforeLoopEnd
          ? idx === totalItems - 1
          : idx === cursor - 1
        const isActive = idx === cursor
        const isAfterActive = isCursorAfterLoopStart
          ? idx === 0
          : idx === cursor + 1

        const data = {
          isActive: isActive,
          show: isBeforeActive || isAfterActive,
        } as CalculateItemPositionAndOpacityPayload
        if (isBeforeActive) {
          data.divStyle = {
            transform: `translateX(calc(${-1} * (75%)))`,
          }
          return data
        }
        if (isAfterActive && isCursorAfterLoopStart) {
          data.divStyle = {
            transform: `translateX(calc(${1} * (75%)))`,
          }
          return data
        }
        data.divStyle =
          isActive || isBeforeActive || isAfterActive
            ? {
                transform: `translateX(calc(${idx - cursor} * (75%)))`,
              }
            : {}
        return data
      },
      []
    )

  useEffect(() => {
    const interval = setInterval(() => {
      setCounterInSec((sec) => sec + 1)
    }, 1000)
    return () => clearInterval(interval)
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
        const itemData = calculateItemPositionAndOpacity({
          idx,
          cursor,
          totalItems: generativeToken.objkts.length,
        })
        return (
          <div
            key={objkt.id}
            style={itemData.divStyle}
            className={cs({
              [style.show]: itemData.show,
              [style.is_active]: itemData.isActive,
            })}
          >
            <div
              className={cs({
                [style.square]: itemData.isActive,
              })}
            >
              <Link href={`/generative/slug/${generativeToken.slug}`}>
                <a>
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
                </a>
              </Link>
              <div className={style.details}>
                {itemData.isActive && (
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
                  <div className={style.infos_text}>
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
                        size="regular"
                        toggeable={true}
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
