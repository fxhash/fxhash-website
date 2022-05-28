import React, { memo } from 'react';
import { User } from "../../types/entities/User";

interface UserOffersReceivedProps {
  user: User
}

const _UserOffersReceived = (props: UserOffersReceivedProps) => {
  return (
    <div>
offers received
    </div>
  );
};

export const UserOffersReceived = memo(_UserOffersReceived);
