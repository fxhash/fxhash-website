import { RenderElementProps, useFocused, useSelected } from "slate-react"
import style from "./MentionEditor.module.scss"
import { UserFromAddress } from "../../../User/UserFromAddress"
import cs from "classnames"
import { UserBadge } from "../../../User/UserBadge"
import { MentionDisplay } from "./MentionDisplay"

export const MentionEditor = ({
  attributes,
  children,
  element,
}: RenderElementProps) => {
  const selected = useSelected()
  const focused = useFocused()
  return (
    <span
      {...attributes}
      contentEditable={false}
      className={cs({
        [style.mention_focused]: selected && focused,
      })}
    >
      {children}
      <MentionDisplay tzAddress={element.tzAddress} />
    </span>
  )
}
