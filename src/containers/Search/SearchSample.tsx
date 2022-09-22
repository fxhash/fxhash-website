import React, { memo, useCallback, useState } from "react"
import style from "./SearchSample.module.scss"
import Link from "next/link"

interface SearchSampleProps {
  className?: string
  title: string
  hrefExploreMore: string
  onFetchMore: () => void
  onClickExploreMore: () => void
  hasMoreResults?: boolean
  children: (props: { showMoreResults: boolean }) => any
}

const _SearchSample = ({
  className,
  title,
  hrefExploreMore,
  hasMoreResults,
  onClickExploreMore,
  onFetchMore,
  children,
}: SearchSampleProps) => {
  const [showMoreResults, setShowMoreResults] = useState(false)
  const handleClickShowMore = useCallback(() => {
    if (!showMoreResults) {
      setShowMoreResults(true)
      return
    }
    onFetchMore()
  }, [onFetchMore, showMoreResults])
  return (
    <div className={className}>
      <div className={style.container_title}>
        <h3>{title}</h3>
        <Link href={hrefExploreMore} as={hrefExploreMore} shallow>
          <a className={style.explore_more} onClick={onClickExploreMore}>
            explore more <i aria-hidden="true" className="fas fa-arrow-right" />
          </a>
        </Link>
      </div>
      <div>{children({ showMoreResults })}</div>
      <hr />
      {hasMoreResults && (
        <div className={style.container_show_more}>
          <button
            type="button"
            className={style.show_more}
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
