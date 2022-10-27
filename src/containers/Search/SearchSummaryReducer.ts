import { SearchQuery } from "./SearchSummary"

export const defaultHasMoreResults = {
  users: {
    results: true,
    loading: false,
  },
  generativeTokens: {
    results: true,
    loading: false,
  },
  articles: {
    results: true,
    loading: false,
  },
  listings: {
    results: true,
    loading: false,
  },
}
export function reducerHasMoreResults(
  state: HasMoreResultsState,
  action: HasMoreResultsAction
) {
  switch (action.type) {
    case "set":
      return action.payload
    case "setHasMoreResults":
      const { key, state: results } = action.payload
      return {
        ...state,
        [key]: {
          ...state[key],
          results: results,
        },
      }
    case "setLoading":
      const { key: dKey, state: loading } = action.payload
      return {
        ...state,
        [dKey]: {
          ...state[dKey],
          loading,
        },
      }
    case "reset":
      return { ...defaultHasMoreResults }
    default:
      throw new Error(`action doesn't exist`)
  }
}
export type HasMoreResultsState = Record<
  keyof SearchQuery,
  { results: boolean; loading: boolean }
>
export type HasMoreResultsAction =
  | { type: "reset" }
  | { type: "set"; payload: HasMoreResultsState }
  | {
      type: "setHasMoreResults"
      payload: {
        key: keyof SearchQuery
        state: boolean
      }
    }
  | {
      type: "setLoading"
      payload: {
        key: keyof SearchQuery
        state: boolean
      }
    }
