import React, {
  CSSProperties,
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

interface ContainerCSSProperties extends CSSProperties {
  "--pages-nb": number
}

export interface CarouselOptions {
  loop?: boolean
  showButtonControls?: boolean
  showDots?: boolean
}
interface CarouselProps {
  className?: string
  classNameDots?: string
  page: number
  totalPages: number
  onChangePage: (page: number) => void
  renderSlide: (idx: number) => any
  options?: CarouselOptions
}

const _Carousel = ({
  className,
  classNameDots,
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
  // reference to the container of the pages
  const container = useRef<HTMLDivElement>(null)

  // because we need to update the page on scroll AND update the scroll when the
  // page changes, we need to know when to disable the later when scrolling
  const preventScrollOnPageChange = useRef<boolean>(false)

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

  const arrayTotalPages = useMemo(() => [...Array(totalPages)], [totalPages])

  // syncs the scroll position with the page, if not during a scroll
  useEffect(() => {
    if (preventScrollOnPageChange.current) {
      preventScrollOnPageChange.current = false
    } else {
      const el = container.current
      if (el) {
        const pos = (page / arrayTotalPages.length) * el.scrollWidth
        el.scroll({
          left: pos,
          behavior: "auto",
        })
      }
    }
  }, [page, arrayTotalPages])

  // updates the page when scrolling in the container
  const onScroll = useCallback(
    (evt) => {
      const el = container.current
      if (el) {
        const idx = Math.floor(
          (el.scrollLeft / el.scrollWidth + 0.05) * arrayTotalPages.length
        )
        if (page !== idx) {
          preventScrollOnPageChange.current = true
          onChangePage(idx)
        }
      }
    },
    [page, onChangePage, arrayTotalPages]
  )

  return (
    <>
      <div className={cs(style.pages_wrapper)}>
        <div
          className={cs(style.pages, className)}
          ref={container}
          onScroll={onScroll}
          style={
            {
              "--pages-nb": arrayTotalPages.length,
            } as ContainerCSSProperties
          }
        >
          {arrayTotalPages.map((_, idx) => (
            <div key={idx} className={style.page}>
              {renderSlide(idx)}
            </div>
          ))}
        </div>
      </div>

      {options?.showDots && (
        <div className={cs(style.dots, classNameDots)}>
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
