import React, { memo, useMemo } from 'react';
import { User } from "../../types/entities/User";
import { useQuery } from "@apollo/client";
import { Qu_userOffersReceived } from "../../queries/user";
import { TableUserOffersReceived } from "../../components/Tables/TableOffersReceived";

interface UserOffersReceivedProps {
  user: User
}

const _UserOffersReceived = ({ user }: UserOffersReceivedProps) => {
  const { data, loading } = useQuery(Qu_userOffersReceived, {
    notifyOnNetworkStatusChange: true,
    variables: {
      id: user.id,
      filters: {
        active_eq: true
      }
    }
  })
  const offers = useMemo(() => data?.user?.offersReceived || [], [data?.user?.offersReceived])
  // todo intinite loader
  return (
    <div>
      <TableUserOffersReceived
        loading={loading}
        offers={offers}
      />
    </div>
  );
};

export const UserOffersReceived = memo(_UserOffersReceived);
