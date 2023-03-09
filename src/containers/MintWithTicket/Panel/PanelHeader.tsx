import style from "./PanelHeader.module.scss"
import cs from "classnames"

interface Props {
  title: React.ReactNode
  description: React.ReactNode
}

export function PanelHeader(props: Props) {
  const {
    title = "fx(lens)",
    description = "Local environment for fxhash projects",
  } = props
  return (
    <header className={cs(style.root)}>
      <h1>{title}</h1>
      <small>{description}</small>
    </header>
  )
}
