import style from "./Tags.module.scss"
import cs from "classnames"
import { Tag } from "./Tag"

interface Props {
  className?: string
  tags: string[]
}
export function Tags({ tags, className }: Props) {
  return (
    <div className={cs(style.root, className)}>
      {tags.map((tag, idx) => (
        <Tag key={idx}>{tag}</Tag>
      ))}
    </div>
  )
}
