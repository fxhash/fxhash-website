import React, { memo } from "react"
import { UserFromAddress } from "../../../User/UserFromAddress"
import style from "./MentionEditor.module.scss"
import cs from "classnames"
import Link from "next/link"
import { getUserName, getUserProfileLink } from "../../../../utils/user"

interface MentionDisplayProps {
  tzAddress: string
}

const _MentionDisplay = ({ tzAddress }: MentionDisplayProps) => (
  <UserFromAddress address={tzAddress}>
    {({ user }) => (
      <Link href={getUserProfileLink(user)}>
        <a className={cs(style.mention_user, style.mention_display)}>
          {`@`}
          {getUserName(user)}
        </a>
      </Link>
    )}
  </UserFromAddress>
)

export const MentionDisplay = memo(_MentionDisplay)
