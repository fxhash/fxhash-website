import React, { memo } from 'react';
import { User } from "../../types/entities/User";

interface UserOffersSentProps {
  user: User
}

const _UserOffersSent = (props: UserOffersSentProps) => {
  return (
    <div>
offers sent
    </div>
  );
};

export const UserOffersSent = memo(_UserOffersSent);
