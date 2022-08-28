import React, { memo } from 'react';
import { UserFromAddress } from "../../../User/UserFromAddress";
import { UserBadge } from "../../../User/UserBadge";
import style from "./MentionEditor.module.scss";
import cs from "classnames";

interface MentionDisplayProps {
  tzAddress: string
}

const _MentionDisplay = ({ tzAddress }: MentionDisplayProps) => (
  <UserFromAddress
    address={tzAddress}
  >
    {({ user }) => (
      <UserBadge
        className={cs(style.mention_user, style.mention_display)}
        size="small"
        user={user}
        hasLink
        isInline
      />
    )}
  </UserFromAddress>
);

export const MentionDisplay = memo(_MentionDisplay);
