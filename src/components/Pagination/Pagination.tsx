import style from "./Pagination.module.scss"
import text from "../../styles/Text.module.css"
import cs from "classnames"
import { useEffect, useMemo, useState, Fragment } from "react"


interface Props {
  activePage: number
  itemsCount: number
  itemsPerPage: number,
  onChange: (page: number) => void
}

export function Pagination({
  activePage,
  itemsCount,
  itemsPerPage,
  onChange
}: Props) {
  const nbPages = Math.ceil(itemsCount / itemsPerPage)

  // build the array of visible page btns based on their distance to the current page and
  // extremities
  const pages = useMemo<number[]>(() => {
    const P: number[] = []
    let D
    for (let i = 0; i < nbPages; i++) {
      D = Math.min(Math.abs(i - activePage), i, (nbPages-1)-i)
      if (D < 3) {
        if (i - P[P.length-1] > 1) P.push(-1)
        P.push(i)
      }
    }
    return P
  }, [activePage, nbPages])

  return (
    <div className={cs(style.container)}>
      <button
        className={cs(style.page, text.h4, {
          [style.disabled]: activePage === 0
        })}
        onClick={() => {
          onChange(activePage-1 < 0 ? 0 : activePage-1)
        }}
      >
        <i aria-hidden className="fas fa-caret-left"/>
      </button>

      <div className={cs(style.pages)}>
        {pages.map(page => (
          <Fragment key={page}>
            {page < 0
              ? <span>...</span>
              : (
                <button
                  className={cs(style.page, text.h4, {
                    [style.active]: page ===  activePage
                  })}
                  onClick={() => {
                    onChange(page)
                  }}
                >
                  {page+1}
                </button>
              )}
          </Fragment>
        ))}
      </div>

      <button
        className={cs(style.page, text.h4, {
          [style.disabled]: activePage === nbPages-1
        })}
        onClick={() => {
          onChange(activePage+1 > nbPages-1 ? nbPages-1 : activePage+1)
        }}
      >
        <i aria-hidden className="fas fa-caret-right"/>
      </button>
    </div>
  )
}
