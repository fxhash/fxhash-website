import { displayMutez } from "./units"

export interface ITagsFilters {
  price_gte: (value: number) => string
  price_lte: (value: number) => string
  supply_gte: (value: number) => string
  supply_lte: (value: number) => string
  tokenSupply_gte: (value: number) => string
  tokenSupply_lte: (value: number) => string
  authorVerified_eq: (value: boolean) => string
  mintProgress_eq: (value: string) => string
  fullyMinted_eq: (isFullyMinted: boolean) => string
  searchQuery_eq: (value: string) => string
  activeListing_exist: (value: boolean) => string
  redeemable_eq: (value: boolean) => string
  redeemed_eq: (value: boolean) => string
}

export const tagsFilters: ITagsFilters = {
  price_gte: (value) => `price >= ${displayMutez(value)} tez`,
  price_lte: (value) => `price <= ${displayMutez(value)} tez`,
  supply_gte: (value) => `editions >= ${value}`,
  supply_lte: (value) => `editions <= ${value}`,
  tokenSupply_gte: (value) => `editions >= ${value}`,
  tokenSupply_lte: (value) => `editions <= ${value}`,
  authorVerified_eq: (value) => `artist: ${value ? "verified" : "un-verified"}`,
  mintProgress_eq: (value) => `mint progress: ${value?.toLowerCase()}`,
  fullyMinted_eq: (isFullyMinted) =>
    `mint: ${isFullyMinted ? "completed" : "on-going"}`,
  searchQuery_eq: (value) => `search: ${value}`,
  activeListing_exist: (value) =>
    `listings: ${value ? "for sale" : "not for sale"}`,
  redeemable_eq: (value) => `redeemable: ${value ? "yes" : "no"}`,
  redeemed_eq: (value) => `redeemed: ${value ? "yes" : "no"}`,
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
      tagsFilters[key as keyof ITagsFilters]
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
