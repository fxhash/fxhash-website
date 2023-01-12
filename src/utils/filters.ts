import { displayMutez } from "./units"

type Transform = (param?: string) => any | undefined
type Encode = (value?: any) => string | undefined

const transformDefault: Transform = (param) => param || undefined
const transformAsBoolean: Transform = (param) =>
  param ? param === "1" : undefined
const transformAsInt: Transform = (param) =>
  param ? parseInt(param) : undefined

const encodeDefault: Encode = (value: string | number | boolean) =>
  value ? encodeURIComponent(value) : undefined
const encodeAsBoolean: Encode = (value) =>
  value !== undefined ? encodeURIComponent(value ? "1" : "0") : undefined

interface Filter<Type> {
  urlParam: string
  transform: Transform
  encode: Encode
  getLabel: (value: Type) => string
}

type FilterKey =
  | "price_gte"
  | "price_lte"
  | "supply_gte"
  | "supply_lte"
  | "tokenSupply_gte"
  | "tokenSupply_lte"
  | "authorVerified_eq"
  | "mintProgress_eq"
  | "fullyMinted_eq"
  | "searchQuery_eq"
  | "activeListing_exist"

export interface ITagsFilters {
  supply_gte: (value: number) => string
  supply_lte: (value: number) => string
  mintProgress_eq: (value: string) => string
  activeListing_exist: (value: boolean) => string
}

export const tagsFilters: Record<FilterKey, Filter<any>> = {
  price_gte: {
    urlParam: "price_gte",
    transform: transformDefault,
    encode: encodeDefault,
    getLabel: (value) => `price >= ${displayMutez(value)} tez`,
  },
  price_lte: {
    urlParam: "price_lte",
    transform: transformDefault,
    encode: encodeDefault,
    getLabel: (value) => `price <= ${displayMutez(value)} tez`,
  },
  supply_gte: {
    urlParam: "editions_gte",
    transform: transformAsInt,
    encode: encodeDefault,
    getLabel: (value) => `editions >= ${value}`,
  },
  supply_lte: {
    urlParam: "editions_lte",
    transform: transformAsInt,
    encode: encodeDefault,
    getLabel: (value) => `editions <= ${value}`,
  },
  tokenSupply_gte: {
    urlParam: "supply_gte",
    transform: transformAsInt,
    encode: encodeDefault,
    getLabel: (value) => `editions >= ${value}`,
  },
  tokenSupply_lte: {
    urlParam: "supply_lte",
    transform: transformAsInt,
    encode: encodeDefault,
    getLabel: (value) => `editions <= ${value}`,
  },
  authorVerified_eq: {
    urlParam: "verified",
    transform: transformAsBoolean,
    encode: encodeAsBoolean,
    getLabel: (value) => `artist: ${value ? "verified" : "un-verified"}`,
  },
  mintProgress_eq: {
    urlParam: "progress",
    transform: transformDefault,
    encode: encodeDefault,
    getLabel: (value) => `mint progress: ${value?.toLowerCase()}`,
  },
  fullyMinted_eq: {
    urlParam: "fullMint",
    transform: transformAsBoolean,
    encode: encodeAsBoolean,
    getLabel: (isFullyMinted) =>
      `mint: ${isFullyMinted ? "completed" : "on-going"}`,
  },
  searchQuery_eq: {
    urlParam: "search",
    transform: transformDefault,
    encode: encodeDefault,
    getLabel: (value) => `search: ${value}`,
  },
  activeListing_exist: {
    urlParam: "hasActiveListing",
    transform: transformAsBoolean,
    encode: encodeAsBoolean,
    getLabel: (value) => `listings: ${value ? "for sale" : "not for sale"}`,
  },
}

interface TagOption<TFilters> {
  key: keyof TFilters
  value: any
  label: string
}
export const getTagsFromFiltersObject = <TFilters, TTag>(
  filtersObj: TFilters,
  onFound: (option: TagOption<TFilters>) => TTag
): TTag[] => {
  return Object.entries(filtersObj).reduce((acc, [key, value]) => {
    const getTag: (value: any) => string =
      tagsFilters[key as keyof ITagsFilters]?.getLabel
    if (value !== undefined && getTag) {
      const tagLabel = getTag(value)
      acc.push(
        onFound({
          key: key as keyof TFilters,
          value,
          label: tagLabel,
        })
      )
    }
    return acc
  }, [] as TTag[])
}

/**
 * Given a record of query parameters, outputs some Listing filters
 */
export const getFiltersFromUrlQuery = <Filters>(
  urlQuery: Record<string, string>
) => {
  const loadedFilters = {} as Filters
  // go through each prop of the handler and eventually transform query param
  for (const K in tagsFilters) {
    const F = K as keyof Filters
    const handler = tagsFilters[F as FilterKey]
    if (urlQuery[handler.urlParam]) {
      loadedFilters[F] = handler.transform(urlQuery[handler.urlParam])
    }
  }
  return loadedFilters
}

export const getUrlQueryFromFilters = <Filters>(filters: Filters) => {
  const query: any = {}

  // go through each prop of the handler and eventually encode query param
  for (const K in tagsFilters) {
    const F = K as keyof Filters
    const handler = tagsFilters[F as FilterKey]
    const encoded = handler.encode(filters[F])
    if (encoded) {
      query[handler.urlParam] = encoded
    }
  }
  return query
}
