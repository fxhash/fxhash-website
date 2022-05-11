import { displayMutez } from "./units";

export interface ITagsFilters {
  "price_gte": (value: number) => string,
  "price_lte": (value: number) => string,
  "supply_gte": (value: number) => string,
  "supply_lte": (value: number) => string,
  "authorVerified_eq": (value: boolean) => string,
  "mintProgress_eq": (value: string) => string,
  "searchQuery_eq": (value: string) => string,
}

export const tagsFilters: ITagsFilters = {
  "price_gte": (value) => `price >= ${displayMutez(value)} tez`,
  "price_lte": (value) => `price <= ${displayMutez(value)} tez`,
  "supply_gte": (value) => `editions >= ${value}`,
  "supply_lte": (value) => `editions <= ${value}`,
  "authorVerified_eq": (value) => `artist: ${value ? "verified" : "un-verified"}`,
  "mintProgress_eq": (value) => `mint progress: ${value?.toLowerCase()}`,
  "searchQuery_eq": (value) => `search: ${value}`
}
