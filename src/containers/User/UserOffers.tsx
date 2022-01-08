import { useQuery } from "@apollo/client"
import cs from "classnames"
import { useRef, useEffect } from "react"
import { CardsContainer } from "../../components/Card/CardsContainer"
import { ObjktCard } from "../../components/Card/ObjktCard"
import { LoaderBlock } from "../../components/Layout/LoaderBlock"
import { InfiniteScrollTrigger } from "../../components/Utils/InfiniteScrollTrigger"
import { Qu_userOffers } from "../../queries/user"
import { Offer } from "../../types/entities/Offer"
import { User } from "../../types/entities/User"

interface Props {
  user: User
}
export function UserOffers({
  user,
}: Props) {
  // use to know when to stop loading
  const currentLength = useRef<number>(0)
  const ended = useRef<boolean>(false)

  const { data, loading, fetchMore } = useQuery(Qu_userOffers, {
    notifyOnNetworkStatusChange: true,
    variables: {
      id: user.id,
      skip: 0,
      take: 20
    }
  })

  useEffect(() => {
    if (!loading) {
      if (currentLength.current === data.user.offers?.length) {
        ended.current = true
      }
      else {
        currentLength.current = data.user.offers?.length
      }
    }
  }, [data, loading])

  const load = () => {
    if (!ended.current) {
      fetchMore({
        variables: {
          id: user.id,
          skip: data?.user.offers.length || 0,
          take: 20
        }
      })
    }
  }

  const offers: Offer[]|null = data?.user.offers || null

  return (
    <>
      <InfiniteScrollTrigger
        onTrigger={load}
      >
        <CardsContainer>
          {offers?.map(offer => (
            <ObjktCard
              key={offer.objkt.id}
              objkt={offer.objkt}
            />
          ))}
        </CardsContainer>
      </InfiniteScrollTrigger>

      {loading && data && <LoaderBlock height="100px"/>}
    </>
  )
}