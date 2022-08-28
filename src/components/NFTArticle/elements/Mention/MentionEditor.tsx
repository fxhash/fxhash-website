import { RenderElementProps, useFocused, useSelected } from "slate-react";
import style from "./MentionEditor.module.scss";
import { UserFromAddress } from "../../../User/UserFromAddress";
import cs from "classnames";
import { UserBadge } from "../../../User/UserBadge";

export const MentionEditor = ({ attributes, children, element }: RenderElementProps) => {
  const selected = useSelected()
  const focused = useFocused()
  return (
    <span
      {...attributes}
      contentEditable={false}
      className={cs({
        [style.mention_focused]: selected && focused
      })}
    >
      {children}
      <UserFromAddress
        address={element.tzAddress}
      >
        {({ user }) => (
          <UserBadge
            className={style.mention_user}
            size="small"
            user={user}
            hasLink
            isInline
          />
        )}
      </UserFromAddress>
    </span>
  )
}
