import style from "./ExploreTags.module.scss"
import cs from "classnames"
import { ExploreTag } from "./ExploreTag"


export interface ExploreTagDef {
  value: string
  onClear: () => void
}

interface Props {
  terms: ExploreTagDef[]
}
export function ExploreTags({
  terms,
}: Props) {
  return (
    <div className={cs(style.root)}>
      {terms.map(term => (
        <ExploreTag
          key={term.value}
          term={term.value}
          onClear={term.onClear}
        />
      ))}
    </div>
  )
}