import { IOptions } from "../components/Input/Select"

export function sortValueToSortVariable(val: string): Record<string, string> {
  if (val === "pertinence") return {}
  const split = val.split("-")
  return {
    [split[0]]: split[1].toUpperCase(),
  }
}
const sortOptionWithCustomLabel = (
  option: IOptions,
  newLabel: string
): IOptions => {
  return {
    ...option,
    label: newLabel,
  }
}

export const getSortOptionsWithSearchOption = (
  currentSortOptions: IOptions[]
) => [sortOptions["relevance-desc"], ...currentSortOptions]

type SortValue =
  | "mintOpensAt-desc"
  | "mintOpensAt-asc"
  | "price-asc"
  | "price-desc"
  | "supply-asc"
  | "supply-desc"
  | "balance-asc"
  | "balance-desc"
  | "createdAt-asc"
  | "createdAt-desc"
  | "relevance-desc"

export const sortOptions: Record<SortValue, IOptions> = {
  "mintOpensAt-desc": {
    label: "recently minted",
    value: "mintOpensAt-desc",
  },
  "mintOpensAt-asc": {
    label: "oldest minted",
    value: "mintOpensAt-asc",
  },
  "price-asc": {
    label: "price (low to high)",
    value: "price-asc",
  },
  "price-desc": {
    label: "price (high to low)",
    value: "price-desc",
  },
  "supply-asc": {
    label: "editions (low to high)",
    value: "supply-asc",
  },
  "supply-desc": {
    label: "editions (high to low)",
    value: "supply-desc",
  },
  "balance-asc": {
    label: "balance (low to high)",
    value: "balance-asc",
  },
  "balance-desc": {
    label: "balance (high to low)",
    value: "balance-desc",
  },
  "relevance-desc": {
    label: "search relevance",
    value: "relevance-desc",
  },
  "createdAt-desc": {
    label: "recent",
    value: "createdAt-desc",
  },
  "createdAt-asc": {
    label: "oldest",
    value: "createdAt-asc",
  },
}

export const sortOptionsCollections: IOptions[] = [
  sortOptions["mintOpensAt-desc"],
  sortOptions["mintOpensAt-asc"],
  sortOptions["price-asc"],
  sortOptions["price-desc"],
  sortOptions["supply-asc"],
  sortOptions["supply-desc"],
  sortOptions["balance-asc"],
  sortOptions["balance-desc"],
]

export const sortOptionsArticles: IOptions[] = [
  sortOptions["createdAt-desc"],
  sortOptions["createdAt-asc"],
]

export const sortOptionsGenerativeTokens: IOptions[] = [
  sortOptions["mintOpensAt-desc"],
  sortOptions["mintOpensAt-asc"],
  sortOptions["price-asc"],
  sortOptions["price-desc"],
  sortOptions["supply-asc"],
  sortOptions["supply-desc"],
  sortOptions["balance-asc"],
  sortOptions["balance-desc"],
]

export const sortOptionsMarketplace: IOptions[] = [
  sortOptionWithCustomLabel(sortOptions["createdAt-desc"], "recently listed"),
  sortOptions["price-desc"],
  sortOptions["price-asc"],
  sortOptionWithCustomLabel(sortOptions["createdAt-asc"], "oldest listed"),
]

export const sortOptionsUsers: IOptions[] = [
  sortOptionWithCustomLabel(
    sortOptions["createdAt-desc"],
    "recently registered"
  ),
  sortOptionWithCustomLabel(sortOptions["createdAt-asc"], "oldest registered"),
]
