import { ListingFilters } from "../../types/entities/Listing"
import { useRouter } from "next/router"
import {
  getSortFromUrlQuery,
  getSortOptionsWithSearchOption,
  sortOptionsMarketplaceSold,
} from "../../utils/sort"
import { GalleryMarketplace } from "../../components/Gallery/GalleryMarketplace"
import { useEffect, useState } from "react"
import { buildUrlFromQuery } from "../../utils/url"
import {
  getFiltersFromUrlQuery,
  getUrlQueryFromFilters,
} from "../../utils/filters"

const searchSortOptions = getSortOptionsWithSearchOption(
  sortOptionsMarketplaceSold
)
const defaultFilters = { acceptedAt_exist: true }

interface Props {
  urlQuery: Record<string, string>
}
export const MarketplaceSold = ({ urlQuery }: Props) => {
  const [filters, setFilters] = useState<ListingFilters>(
    getFiltersFromUrlQuery<ListingFilters>(urlQuery)
  )
  const [sort, setSort] = useState(
    getSortFromUrlQuery(urlQuery, searchSortOptions, sortOptionsMarketplaceSold)
  )
  const router = useRouter()

  useEffect(() => {
    const query = getUrlQueryFromFilters(filters)
    query.sort = encodeURIComponent(sort)

    router.push(
      { pathname: router.pathname, query },
      buildUrlFromQuery(router.pathname, query),
      { shallow: true }
    )
  }, [filters, sort])

  return (
    <GalleryMarketplace
      defaultSortOptions={sortOptionsMarketplaceSold}
      defaultFilters={defaultFilters}
      initialSearchQuery={urlQuery.search}
      initialFilters={filters}
      initialSort={sort}
      onChangeFilters={setFilters}
      onChangeSort={setSort}
    />
  )
}
