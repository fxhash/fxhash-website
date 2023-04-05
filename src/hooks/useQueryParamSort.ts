import { IOptions } from "components/Input/Select"
import { useRouter } from "next/router"
import { useEffectAfterRender } from "./useEffectAfterRender"
import useSort, { UseSortParams } from "./useSort"
import { NextParsedUrlQuery } from "next/dist/server/request-meta"

const initializeFromQueryParam = <T>(
  options: IOptions<T>[],
  routerQuery: NextParsedUrlQuery,
  defaultSort?: string
) => {
  // get the sort value from the query param
  const { sort: sortQueryParam } = routerQuery as { sort: T }
  // check if the sort value is valid
  const isValid = options.find((option) => option.value === sortQueryParam)
  // if it's valid, return it, otherwise return the default sort
  return isValid ? sortQueryParam : defaultSort
}

export const useQueryParamSort = <T extends string | undefined>(
  options: IOptions<T>[],
  { defaultSort, defaultWithSearchOptions }: UseSortParams = {}
) => {
  const router = useRouter()

  const {
    sortValue,
    setSortValue,
    sortVariable,
    restoreSort,
    setSearchSortOptions,
    sortOptions,
  } = useSort(options, {
    defaultSort: initializeFromQueryParam(options, router.query, defaultSort),
    defaultWithSearchOptions,
  })

  const setSortQueryParam = (sort: string) =>
    router.replace(
      {
        query: {
          ...router.query,
          sort,
        },
      },
      undefined,
      { shallow: true }
    )

  useEffectAfterRender(() => {
    setSortQueryParam(sortValue)
  }, [sortValue])

  return {
    sortValue,
    setSortValue,
    sortVariable,
    restoreSort,
    setSearchSortOptions,
    sortOptions,
  }
}
