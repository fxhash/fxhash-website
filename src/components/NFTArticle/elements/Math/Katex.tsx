import React, { memo, useMemo } from "react"
import KaTeX from "katex"
import style from "./BlockKatex.module.scss"
import cs from "classnames"

interface KatexProps {
  children: string
  inline?: boolean
}

const _Katex = ({ children, inline }: KatexProps) => {
  const html = useMemo(() => {
    const generatedHtml = KaTeX.renderToString(children, {
      displayMode: !inline,
      throwOnError: false,
    })
    return { __html: generatedHtml }
  }, [children, inline])
  return (
    <span
      contentEditable={false}
      dangerouslySetInnerHTML={html}
      className={cs(style.render)}
    />
  )
}

export const Katex = memo(_Katex)
