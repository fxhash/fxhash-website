import { ListingFilters } from "../types/entities/Listing"
import { useRouter } from "next/router"
import {
  getSortOptionsWithSearchOption,
  sortOptionsMarketplace,
} from "../utils/sort"
import { GalleryMarketplace } from "../components/Gallery/GalleryMarketplace"
import { useEffect, useState } from "react"
import { buildUrlFromQuery } from "../utils/url"

interface Props {
  urlQuery: Record<string, string>
}

// a map of (listing filter) => transformer
// to turn the query parameters into gql-ready variables
type TQueryFilterHandler = {
  param: string
  transform: (param?: string) => any | undefined
  encode: (value?: any) => string | undefined
}
const queryListingFilterHandlers: Record<
  keyof ListingFilters,
  TQueryFilterHandler
> = {
  price_lte: {
    param: "price_lte",
    transform: (param) => param || undefined,
    encode: (value) => (value ? encodeURIComponent(value) : undefined),
  },
  price_gte: {
    param: "price_gte",
    transform: (param) => param || undefined,
    encode: (value) => (value ? encodeURIComponent(value) : undefined),
  },
  fullyMinted_eq: {
    param: "fullMint",
    transform: (param) => (param ? param === "1" : undefined),
    encode: (value) =>
      value !== undefined ? encodeURIComponent(value ? "1" : "0") : undefined,
  },
  authorVerified_eq: {
    param: "verified",
    transform: (param) => (param ? param === "1" : undefined),
    encode: (value) =>
      value !== undefined ? encodeURIComponent(value ? "1" : "0") : undefined,
  },
  searchQuery_eq: {
    param: "search",
    transform: (param) => param || undefined,
    encode: (value) => value || undefined,
  },
  tokenSupply_lte: {
    param: "supply_lte",
    transform: (param) => (param ? parseInt(param) : undefined),
    encode: (value) => (value ? encodeURIComponent(value) : undefined),
  },
  tokenSupply_gte: {
    param: "supply_gte",
    transform: (param) => (param ? parseInt(param) : undefined),
    encode: (value) => (value ? encodeURIComponent(value) : undefined),
  },
}

/**
 * Given a record of query parameters, outputs some Listing filters
 */
const getFiltersFromUrlQuery = (urlQuery: Record<string, string>) => {
  const loadedFilters: ListingFilters = {}
  // go through each prop of the handler and eventually transform query param
  for (const K in queryListingFilterHandlers) {
    const F = K as keyof ListingFilters
    const handler = queryListingFilterHandlers[F]
    if (urlQuery[handler.param]) {
      loadedFilters[F] = queryListingFilterHandlers[F].transform(
        urlQuery[handler.param]
      )
    }
  }
  return loadedFilters
}

const searchSortOptions = getSortOptionsWithSearchOption(sortOptionsMarketplace)
const getSortFromUrlQuery = (urlQuery: Record<string, string>) => {
  const { search, sort } = urlQuery

  // if there is a sort value in the url, pre-select it in the sort input
  // else, select the default value
  let defaultSortValue = search ? "relevance-desc" : "createdAt-desc"
  if (sort) {
    let sortValues = search ? searchSortOptions : sortOptionsMarketplace
    return sortValues.map(({ value }) => value).includes(sort)
      ? sort
      : defaultSortValue
  }

  return defaultSortValue
}

export const Marketplace = ({ urlQuery }: Props) => {
  const [filters, setFilters] = useState<ListingFilters>(
    getFiltersFromUrlQuery(urlQuery)
  )
  const [sort, setSort] = useState(getSortFromUrlQuery(urlQuery))
  const router = useRouter()

  useEffect(() => {
    const query: any = {}

    // go through each prop of the handler and eventually encode query param
    for (const K in queryListingFilterHandlers) {
      const F = K as keyof ListingFilters
      const handler = queryListingFilterHandlers[F]
      const encoded = handler.encode(filters[F])
      if (encoded) {
        query[handler.param] = encoded
      }
    }

    query.sort = encodeURIComponent(sort)

    router.push(
      { pathname: router.pathname, query },
      buildUrlFromQuery(router.pathname, query),
      { shallow: true }
    )
  }, [filters, sort])

  return (
    <GalleryMarketplace
      initialSearchQuery={urlQuery.search}
      initialFilters={filters}
      initialSort={sort}
      onChangeFilters={setFilters}
      onChangeSort={setSort}
    />
  )
}
