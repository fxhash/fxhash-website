import style from "./CodeDisplay.module.scss"
import cs from "classnames"
import { PropsWithChildren, useMemo } from "react"
import { getCodeEditorLang } from "./CodeLanguages"

interface Props {
  className: string
}
export function CodeDisplay({ className, children }: PropsWithChildren<Props>) {
  // rehype injects "language-js" as a classname, only way to get the lang
  const lang = useMemo(() => {
    const L = className?.split("-")[1] || null
    return getCodeEditorLang(L)
  }, [className])

  return (
    <div className={cs(style.root)}>
      <span className={cs(style.lang)}>{lang.name}</span>
      <pre>{children}</pre>
    </div>
  )
}
