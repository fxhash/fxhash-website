import { displayMutez } from "./units";

export interface ITagsFilters {
  "price_gte": (value: number) => string,
  "price_lte": (value: number) => string,
  "supply_gte": (value: number) => string,
  "supply_lte": (value: number) => string,
  "authorVerified_eq": (value: boolean) => string,
  "mintProgress_eq": (value: string) => string,
  "searchQuery_eq": (value: string) => string,
  "activeListing_exist": (value: boolean) => string,
  "tokenSupply_gte": (value: number) => string,
  "tokenSupply_lte": (value: number) => string,
  "fullyMinted_eq": (value: boolean) => string,
  "assigned_eq": (value: boolean) => string,
  "author_in": (value: string) => string,
  "issuer_in": (value: string) => string,
}

export const tagsFilters: ITagsFilters = {
  "price_gte": (value) => `price >= ${displayMutez(value)} tez`,
  "price_lte": (value) => `price <= ${displayMutez(value)} tez`,
  "supply_gte": (value) => `editions >= ${value}`,
  "supply_lte": (value) => `editions <= ${value}`,
  "authorVerified_eq": (value) => `artist: ${value ? "verified" : "un-verified"}`,
  "mintProgress_eq": (value) => `mint progress: ${value?.toLowerCase()}`,
  "searchQuery_eq": (value) => `search: ${value}`,
  "activeListing_exist": (value) => `listings: ${value ? 'for sale' : 'not for sale'}`,
  "tokenSupply_gte": (value) => `editions >= ${value}`,
  "tokenSupply_lte": (value) => `editions <= ${value}`,
  "fullyMinted_eq": (value) => `mint: ${value ? "completed" : "on-going"}`,
  "assigned_eq": (value) => `metadata assigned: ${value ? "yes" : "no"} tez`,
  "author_in": (value) => `artists: (${value.length})`,
  "issuer_in": (value) => `generators: (${value.length})`,
}

interface TagOption<TFilters> {
  key: keyof TFilters,
  value: any,
  label: string,
}
export const getTagsFromFiltersObject = <TFilters, TTag>(filtersObj: TFilters, onFound: (option: TagOption<TFilters>) => TTag): TTag[] => {
  return Object.entries(filtersObj).reduce((acc, [key, value]) => {
    const getTag: (value: any) => string = tagsFilters[key as keyof ITagsFilters];
    if (value !== undefined && getTag) {
      const tagLabel = getTag(value);
      acc.push(onFound({
        key: key as keyof TFilters,
        value,
        label: tagLabel,
      }))
    }
    return acc;
  }, [] as TTag[])
}
