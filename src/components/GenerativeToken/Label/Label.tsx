import style from "./Label.module.scss"
import cs from "classnames"
import { GenTokLabelDefinition } from "../../../types/entities/GenerativeToken"

interface Props {
  definition: GenTokLabelDefinition
}
export function Label({ definition }: Props) {
  return (
    <div
      className={cs(style.root, style[`group_${definition.group}`])}
      title={definition.description || definition.label}
    >
      {definition.shortLabel}
    </div>
  )
}
