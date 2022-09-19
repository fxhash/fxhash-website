import style from "./ExploreTag.module.scss"
import cs from "classnames"

interface Props {
  term: string
  onClear: () => void
}

export function ExploreTag({ term, onClear }: Props) {
  return (
    <div className={cs(style.container)}>
      <strong>{term}</strong>
      <i aria-hidden className="fas fa-times" onClick={onClear} />
    </div>
  )
}
