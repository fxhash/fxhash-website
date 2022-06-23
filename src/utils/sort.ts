import { IOptions } from "../components/Input/Select";

export function sortValueToSortVariable(val: string) {
  if (val === "pertinence") return {}
  const split = val.split("-")
  return {
    [split[0]]: split[1].toUpperCase()
  }
}

interface ISortOptions {
  [key: string]: IOptions,
}
export const sortOptions: ISortOptions = {
  'mintOpensAt-desc': {
    label: "recently minted",
    value: "mintOpensAt-desc"
  },
  'mintOpensAt-asc': {
    label: "oldest minted",
    value: "mintOpensAt-asc",
  },
  'price-asc': {
    label: "price (low to high)",
    value: "price-asc",
  },
  'price-desc': {
    label: "price (high to low)",
    value: "price-desc",
  },
  'supply-asc': {
    label: "editions (low to high)",
    value: "supply-asc",
  },
  'supply-desc': {
    label: "editions (high to low)",
    value: "supply-desc",
  },
  'balance-asc': {
    label: "balance (low to high)",
    value: "balance-asc",
  },
  'balance-desc': {
    label: "balance (high to low)",
    value: "balance-desc",
  },
  'relevance-desc': {
    label: "search relevance",
    value: "relevance-desc",
  },
}

export const sortOptionsCollections: IOptions[] = [
  sortOptions['mintOpensAt-desc'],
  sortOptions['mintOpensAt-asc'],
  sortOptions['price-asc'],
  sortOptions['price-desc'],
  sortOptions['supply-asc'],
  sortOptions['supply-desc'],
  sortOptions['balance-asc'],
  sortOptions['balance-desc'],
]
