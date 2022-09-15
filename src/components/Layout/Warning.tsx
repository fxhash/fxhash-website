import React from 'react'
import style from "./Warning.module.scss"
import cs from "classnames"
import { PropsWithChildren } from "react"
import Link from "next/link"

interface Props {
  closeButton: React.ReactNode | null
  children: React.ReactNode
  className: string
}

export function Warning({ children, className, closeButton }:PropsWithChildren<Props>) {
  return (
    <div
      className={cs(className, style.container)}
    >
      <Link href="/article/fx(text)">
        <a>
          <span className={cs(style.message)}>
            {children}
          </span>
        </a>
      </Link>
      {closeButton}
    </div>
  )
}
