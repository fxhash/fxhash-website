import { SectionWrapper } from "../../components/Layout/SectionWrapper"
import { GenerativeToken } from "../../types/entities/GenerativeToken"
import { useQuery } from "@apollo/client"
import { Qu_genTokOffers } from "../../queries/generative-token"
import { ListOffers } from "../../components/List/ListOffers"
import { useContext, useEffect } from "react"
import { UserContext } from "containers/UserProvider"
import { Spacing } from "components/Layout/Spacing"
import { AnyOffer } from "types/entities/Offer"
import { OfferFilters, useOfferFilters } from "components/Offers/OfferFilters"

interface Props {
  token: GenerativeToken
}
export function GenerativeOffers({ token }: Props) {
  const { user } = useContext(UserContext)

  const {
    floorThreshold,
    setFloorThreshold,
    sortValue,
    sortVariable,
    sortOptions,
    setSortValue,
  } = useOfferFilters("marketplaceGenerativeOffers")

  const { data, loading, refetch } = useQuery(Qu_genTokOffers, {
    variables: {
      id: token.id,
      userId: user?.id,
      sort: sortVariable,
    },
  })

  useEffect(() => {
    refetch?.({
      id: token.id,
      userId: user?.id,
      sort: sortVariable,
    })
  }, [sortVariable])

  const filterFloor = (offer: AnyOffer) =>
    offer.price >= (token.marketStats?.floor || 0) * (floorThreshold / 100)

  const offers = data?.generativeToken?.allOffers

  return (
    <SectionWrapper layout="fixed-width-centered">
      <OfferFilters
        floorThreshold={floorThreshold}
        setFloorThreshold={setFloorThreshold}
        sortValue={sortValue}
        sortOptions={sortOptions}
        setSortValue={setSortValue}
        showFloorThreshold={!!token.marketStats?.floor}
      />

      <Spacing size="large" />

      <ListOffers
        offers={offers?.filter(filterFloor)}
        ownsGentkInCollection={data?.generativeToken.isHolder}
        loading={loading}
        floor={token.marketStats?.floor || null}
        showToken
      />
    </SectionWrapper>
  )
}
