import style from "./Tags.module.scss"
import cs from "classnames"
import { Tag } from "./Tag"

interface Props {
  tags: string[]
}
export function Tags({
  tags,
}: Props) {
  return (
    <div className={cs(style.root)}>
      {tags.map((tag, idx) => (
        <Tag key={idx}>
          {tag}
        </Tag>
      ))}
    </div>
  )
}