import style from "./TitleHyphen.module.scss"
import cs from "classnames"
import { FunctionComponent } from "react"

interface Props {
  type?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6"
  flexDirection?: "row" | "column"
}

export const SectionTitle: FunctionComponent<Props> = ({
  type = "h2",
  children,
  flexDirection = "row",
}) => {
  const Htag = type

  return (
    <Htag className={cs(style.title, style[flexDirection])}>{children}</Htag>
  )
}
