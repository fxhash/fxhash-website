import React, { memo, useMemo } from "react"
import style from "./ProgressText.module.scss"

interface ProgressTextProps {
  percent: number
  children: any
}

const _ProgressText = ({ children, percent }: ProgressTextProps) => {
  const spanStyle = useMemo(() => {
    return {
      width: `${percent || 0}%`,
    }
  }, [percent])
  return (
    <span className={style.progress}>
      <span className={style.progress_back}>{children}</span>
      <span className={style.progress_cover} style={spanStyle} />
      <span className={style.progress_color} style={spanStyle}>
        {children}
      </span>
    </span>
  )
}

export const ProgressText = memo(_ProgressText)
