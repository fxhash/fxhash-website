import React, {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react"
import style from "./Carousel.module.scss"
import { Button } from "../Button"
import cs from "classnames"

export interface CarouselOptions {
  loop?: boolean
  showButtonControls?: boolean
  showDots?: boolean
}
interface CarouselProps {
  className?: string
  page: number
  totalPages: number
  onChangePage: (page: number) => void
  renderSlide: (idx: number) => any
  options?: CarouselOptions
}

const _Carousel = ({
  className,
  page,
  totalPages,
  onChangePage,
  renderSlide,
  options = {
    loop: false,
    showButtonControls: true,
    showDots: false,
  },
}: CarouselProps) => {
  const [swipeOffset, setSwipeOffset] = useState(0)
  const refPages = useRef<HTMLDivElement>(null)
  const refTouch = useRef<{ start: number }>({
    start: 0,
  })
  const handleOnClickNext = useCallback(() => {
    onChangePage(page + 1 > totalPages - 1 ? 0 : page + 1)
  }, [onChangePage, page, totalPages])
  const handleOnClickPrev = useCallback(() => {
    onChangePage(page - 1 < 0 ? totalPages - 1 : page - 1)
  }, [onChangePage, page, totalPages])
  const handleClickGoToPage = useCallback(
    (goToPage) => () => {
      onChangePage(goToPage)
    },
    [onChangePage]
  )
  const handleSwipeStart = useCallback((e: TouchEvent) => {
    refTouch.current.start = e.changedTouches[0].screenX
  }, [])
  const handleSwipeMove = useCallback((e: TouchEvent) => {
    const currentX = e.changedTouches[0].screenX
    const move = currentX - refTouch.current.start
    requestAnimationFrame(() => {
      setSwipeOffset(move)
    })
  }, [])
  const handleSwipeEnd = useCallback(
    (e: TouchEvent) => {
      const move = e.changedTouches[0].screenX - refTouch.current.start
      if (move < 0) {
        handleOnClickNext()
      } else if (move > 0) {
        handleOnClickPrev()
      }
      refTouch.current.start = 0
      requestAnimationFrame(() => {
        setSwipeOffset(0)
      })
    },
    [handleOnClickNext, handleOnClickPrev]
  )
  const arrayTotalPages = useMemo(() => [...Array(totalPages)], [totalPages])
  useEffect(() => {
    const el = refPages.current
    if (el) {
      el.addEventListener("touchstart", handleSwipeStart)
      el.addEventListener("touchmove", handleSwipeMove)
      el.addEventListener("touchend", handleSwipeEnd)
    }
    return () => {
      if (el) {
        el.removeEventListener("touchstart", handleSwipeStart)
        el.removeEventListener("touchmove", handleSwipeMove)
        el.removeEventListener("touchend", handleSwipeEnd)
      }
    }
  }, [handleSwipeEnd, handleSwipeMove, handleSwipeStart])
  return (
    <>
      <div className={cs(style.pages, className)} ref={refPages}>
        {arrayTotalPages.map((_, idx) => {
          const pageOffset = (idx - page) * 100
          const pageStyle = {
            transform: `translateX(calc(${pageOffset}vw + ${swipeOffset}px))`,
          }
          return (
            <div key={idx} className={style.page} style={pageStyle}>
              {renderSlide(idx)}
            </div>
          )
        })}
      </div>
      {options?.showDots && (
        <div className={style.dots}>
          {arrayTotalPages.map((_, idx) => {
            return (
              <div
                key={idx}
                className={cs(style.page_control, {
                  [style["page_control--active"]]: idx === page,
                })}
                role="presentation"
                onClick={handleClickGoToPage(idx)}
              />
            )
          })}
        </div>
      )}
      {options?.showButtonControls && (
        <div className={style.controls}>
          <Button
            type="button"
            color="white"
            size="custom"
            className={style.button}
            disabled={!options.loop ? page === 0 : undefined}
            onClick={handleOnClickPrev}
            iconSide={null}
            iconComp={
              <i
                className="fa-sharp fa-solid fa-arrow-left"
                aria-hidden="true"
              />
            }
          />
          <div>{`${page + 1} / ${totalPages}`}</div>
          <Button
            type="button"
            color="white"
            size="custom"
            className={style.button}
            disabled={!options.loop ? page === totalPages - 1 : undefined}
            onClick={handleOnClickNext}
            iconSide={null}
            iconComp={
              <i
                className="fa-sharp fa-solid fa-arrow-right"
                aria-hidden="true"
              />
            }
          />
        </div>
      )}
    </>
  )
}

export const Carousel = memo(_Carousel)
