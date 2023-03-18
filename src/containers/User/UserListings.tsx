import layout from "../../styles/Layout.module.scss"
import cs from "classnames"
import { useQuery } from "@apollo/client"
import { useRef, useEffect, useCallback, useState } from "react"
import { CardsContainer } from "../../components/Card/CardsContainer"
import { ObjktCard } from "../../components/Card/ObjktCard"
import { LoaderBlock } from "../../components/Layout/LoaderBlock"
import { InfiniteScrollTrigger } from "../../components/Utils/InfiniteScrollTrigger"
import { Qu_userListings } from "../../queries/user"
import { Listing } from "../../types/entities/Listing"
import { User } from "../../types/entities/User"
import { CardsLoading } from "../../components/Card/CardsLoading"

const ITEMS_PER_PAGE = 20
interface Props {
  user: User
}
export function UserListings({ user }: Props) {
  const [hasNothingToFetch, setHasNothingToFetch] = useState(false)

  const { data, loading, fetchMore } = useQuery<{ user: User }>(
    Qu_userListings,
    {
      notifyOnNetworkStatusChange: true,
      variables: {
        id: user.id,
        skip: 0,
        take: ITEMS_PER_PAGE,
      },
      onCompleted: (newData) => {
        if (
          !newData?.user?.listings?.length ||
          newData.user.listings.length < ITEMS_PER_PAGE
        ) {
          setHasNothingToFetch(true)
        }
      },
    }
  )

  // safe access to gentoks
  const listings = data?.user?.listings || null
  const handleFetchMore = useCallback(async () => {
    if (loading || hasNothingToFetch) return false
    const { data: newData } = await fetchMore({
      variables: {
        skip: listings?.length || 0,
        take: ITEMS_PER_PAGE,
      },
    })
    if (
      !newData?.user?.listings?.length ||
      newData.user.listings.length < ITEMS_PER_PAGE
    ) {
      setHasNothingToFetch(true)
    }
  }, [fetchMore, hasNothingToFetch, listings?.length, loading])

  return (
    <div className={cs(layout["padding-big"])}>
      {!loading && !listings?.length && <div>No listings</div>}
      <InfiniteScrollTrigger
        onTrigger={handleFetchMore}
        canTrigger={!hasNothingToFetch && !loading}
      >
        <CardsContainer>
          {listings?.map(
            (offer) =>
              offer.objkt && (
                <ObjktCard key={offer.objkt.id} objkt={offer.objkt} />
              )
          )}
        </CardsContainer>
        {loading &&
          CardsLoading({
            number: ITEMS_PER_PAGE,
          })}
      </InfiniteScrollTrigger>
    </div>
  )
}
