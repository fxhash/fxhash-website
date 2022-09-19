import style from "./ExploreTags.module.scss"
import cs from "classnames"
import { ExploreTag } from "./ExploreTag"

export interface ExploreTagDef {
  value: string
  onClear: () => void
}

interface Props {
  terms: ExploreTagDef[]
  onClearAll: () => void
}
export function ExploreTags({ terms, onClearAll }: Props) {
  return (
    <div className={cs(style.root)}>
      {terms.map((term) => (
        <ExploreTag key={term.value} term={term.value} onClear={term.onClear} />
      ))}
      {terms.length > 0 && (
        <button
          type="button"
          className={cs(style.clear_all)}
          onClick={onClearAll}
        >
          clear all
        </button>
      )}
    </div>
  )
}
