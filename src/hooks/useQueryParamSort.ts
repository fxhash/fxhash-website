import { IOptions } from "components/Input/Select"
import { useRouter } from "next/router"
import { useEffect } from "react"
import { useEffectAfterRender } from "./useEffectAfterRender"
import useSort, { UseSortParams } from "./useSort"

export const useQueryParamSort = <T extends string | undefined>(
  options: IOptions<T>[],
  { defaultSort, defaultWithSearchOptions }: UseSortParams = {}
) => {
  const router = useRouter()
  const { sort: sortQueryParam = defaultSort } = router.query as { sort: T }

  const {
    sortValue,
    setSortValue,
    sortVariable,
    restoreSort,
    setSearchSortOptions,
    sortOptions,
  } = useSort(options, {
    defaultSort: sortQueryParam || defaultSort,
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
