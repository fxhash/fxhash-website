import style from "./PanelHeader.module.scss"
import cs from "classnames"

interface Props {
  title: React.ReactNode
  description: React.ReactNode
  onClickHide: () => void
}

export function PanelHeader(props: Props) {
  const {
    title = "fx(lens)",
    description = "Local environment for fxhash projects",
    onClickHide,
  } = props
  return (
    <header className={cs(style.root)}>
      <div className={style.title}>
        <h1>{title}</h1>
        <button
          title="hide panel"
          className={style.button_hide}
          type="button"
          onClick={onClickHide}
        >
          <i aria-hidden className="fa-solid fa-chevrons-up" />
        </button>
      </div>
      <small>{description}</small>
    </header>
  )
}
