import React, { memo, useMemo } from 'react';
import { User } from "../../types/entities/User";
import { useQuery } from "@apollo/client";
import { Qu_userOffersSent } from "../../queries/user";
import { TableUserOffersSent } from "../../components/Tables/TableOffersSent";

interface UserOffersSentProps {
  user: User
}

const _UserOffersSent = ({ user }: UserOffersSentProps) => {
  const { data, loading } = useQuery(Qu_userOffersSent, {
    notifyOnNetworkStatusChange: true,
    variables: {
      id: user.id,
      filters: {
        active_eq: true
      }
    }
  })
  const offers = useMemo(() => data?.user?.offersSent || [], [data?.user?.offersSent])
  // todo intinite loader
  return (
    <div>
      <TableUserOffersSent
        loading={loading}
        offers={offers}
      />
    </div>
  );
};

export const UserOffersSent = memo(_UserOffersSent);
