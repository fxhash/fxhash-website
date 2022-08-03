import { Dispatch, SetStateAction, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { sortValueToSortVariable } from "../utils/sort";
import { IOptions } from "../components/Input/Select";

interface UseSortPayload {
  sortValue: string,
  sortVariable: Record<string, string>,
  setSortValue: Dispatch<SetStateAction<string>>,
  sortOptions: IOptions[],
  setSortOptions:  Dispatch<SetStateAction<IOptions[]>>,
  restoreSort: () => void,
  setSearchSortOptions: () => void,
}
export default function useSort(options: IOptions[], defaultSort: string): UseSortPayload {
  const [sortValue, setSortValue] = useState<string>(defaultSort)
  const [sortOptions, setSortOptions] = useState<IOptions[]>(options)
  const sortBeforeSearch = useRef<string>(sortValue)

  const searchSortOptions = useMemo(() => [
    {
      label: "search relevance",
      value: "relevance-desc",
    },
    ...options
  ], [options])

  const handleRestoreSort = useCallback(() => {
    setSortOptions(options)
    if (sortValue === "relevance-desc") {
      setSortValue(sortBeforeSearch.current)
    }
  }, [options, sortValue]);

  const handleSetSearchSortOptions = useCallback(() => {
    setSortOptions(searchSortOptions)
    setSortValue("relevance-desc")
  }, [searchSortOptions]);

  useEffect(() => {
    if (sortValue !== "relevance-desc") {
      sortBeforeSearch.current = sortValue
    }
  }, [sortValue])

  const sortVariable = useMemo<Record<string, string>>(() => sortValueToSortVariable(
    sortValue
  ), [sortValue])

  return {
    sortValue,
    sortVariable,
    setSortValue,
    sortOptions,
    setSortOptions,
    restoreSort: handleRestoreSort,
    setSearchSortOptions: handleSetSearchSortOptions,
  }
}
