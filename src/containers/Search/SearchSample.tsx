import React, { memo, useCallback, useEffect, useRef, useState } from "react"
import style from "./SearchSample.module.scss"
import text from "../../styles/Text.module.css"
import Link from "next/link"
import { debounce } from "../../utils/debounce"
import cs from "classnames"

interface SearchSampleProps {
  className?: string
  classNameContainerChildren?: string
  title: string
  hrefExploreMore: string
  onFetchMore: () => void
  onClickExploreMore: () => void
  hasMoreResults?: boolean
  children: (props: { showMoreResults: boolean }) => any
}

const _SearchSample = ({
  className,
  classNameContainerChildren,
  title,
  hrefExploreMore,
  hasMoreResults,
  onClickExploreMore,
  onFetchMore,
  children,
}: SearchSampleProps) => {
  const refContainerChildren = useRef<HTMLDivElement>(null)
  const [hasClamp, setHasClamp] = useState(false)
  const [showMoreResults, setShowMoreResults] = useState(false)
  const handleClickShowMore = useCallback(() => {
    if (!showMoreResults) {
      setShowMoreResults(true)
      return
    }
    onFetchMore()
  }, [onFetchMore, showMoreResults])

  useEffect(() => {
    const hasClamping = (el: HTMLDivElement) => {
      const { scrollHeight, clientHeight } = el

      return scrollHeight > clientHeight
    }

    const checkButtonAvailability = () => {
      if (refContainerChildren.current) {
        setHasClamp(hasClamping(refContainerChildren.current))
      }
    }

    const debouncedCheck = debounce(checkButtonAvailability, 50)
    checkButtonAvailability()
    window.addEventListener("resize", debouncedCheck)
    return () => {
      window.removeEventListener("resize", debouncedCheck)
    }
  }, [])
  return (
    <div className={cs(style.root, className)}>
      <div className={style.container_title}>
        <h3>{title}</h3>
        <Link href={hrefExploreMore} as={hrefExploreMore} shallow>
          <a className={style.explore_more} onClick={onClickExploreMore}>
            explore more <i aria-hidden="true" className="fas fa-arrow-right" />
          </a>
        </Link>
      </div>
      <div
        ref={refContainerChildren}
        className={cs(style.container_children, {
          [classNameContainerChildren || ""]: !showMoreResults,
        })}
      >
        {children({ showMoreResults })}
      </div>
      <hr />
      {((hasClamp && !showMoreResults) || hasMoreResults) && (
        <div className={style.container_show_more}>
          <button
            type="button"
            className={cs(style.show_more, text.info)}
            onClick={handleClickShowMore}
          >
            show more results{" "}
            <i aria-hidden="true" className="fa-solid fa-caret-down" />
          </button>
        </div>
      )}
    </div>
  )
}

export const SearchSample = memo(_SearchSample)
