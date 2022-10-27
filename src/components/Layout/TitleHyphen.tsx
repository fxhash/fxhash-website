import style from "./TitleHyphen.module.scss"
import cs from "classnames"
import { FunctionComponent } from "react"

interface Props {
  type?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6"
}

export const TitleHyphen: FunctionComponent<Props> = ({
  type = "h2",
  children,
}) => {
  const Htag = type

  return (
    <Htag className={cs(style.title)}>
      <span>—</span>
      <span>{children}</span>
    </Htag>
  )
}
