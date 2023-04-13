import React, { memo, useEffect, useMemo } from "react"
import { User } from "../../types/entities/User"
import { useQuery } from "@apollo/client"
import { Qu_userOffersReceived } from "../../queries/user"
import { TableUserOffersReceived } from "../../components/Tables/TableOffersReceived"
import { OfferFilters, useOfferFilters } from "components/Offers/OfferFilters"
import { Spacing } from "components/Layout/Spacing"
import { AnyOffer, offerTypeGuard } from "types/entities/Offer"

interface UserOffersReceivedProps {
  user: User
}

const _UserOffersReceived = ({ user }: UserOffersReceivedProps) => {
  const {
    floorThreshold,
    setFloorThreshold,
    sortValue,
    sortVariable,
    sortOptions,
    setSortValue,
  } = useOfferFilters("userDashboardReceivedOffers")

  const { data, loading, refetch } = useQuery(Qu_userOffersReceived, {
    notifyOnNetworkStatusChange: true,
    variables: {
      id: user.id,
      filters: {
        active_eq: true,
      },
      sort: sortVariable,
    },
  })

  const offers = useMemo(
    () => data?.user?.allOffersReceived || [],
    [data?.user?.allOffersReceived]
  )

  useEffect(() => {
    refetch?.({
      id: user.id,
      filters: {
        active_eq: true,
      },
      sort: sortVariable,
    })
  }, [sortVariable])

  const filterFloor = (offer: AnyOffer) => {
    if (offerTypeGuard(offer)) {
      return (
        offer.price >=
        (offer.objkt.issuer.marketStats?.floor || 0) * (floorThreshold / 100)
      )
    }

    return (
      offer.price >=
      (offer.token.marketStats?.floor || 0) * (floorThreshold / 100)
    )
  }

  // todo intinite loader
  return (
    <div>
      <Spacing size="large" />
      <OfferFilters
        floorThreshold={floorThreshold}
        setFloorThreshold={setFloorThreshold}
        sortValue={sortValue}
        sortOptions={sortOptions}
        setSortValue={setSortValue}
      />
      <Spacing size="large" />
      <TableUserOffersReceived
        loading={loading}
        offers={offers.filter(filterFloor)}
      />
    </div>
  )
}

export const UserOffersReceived = memo(_UserOffersReceived)
