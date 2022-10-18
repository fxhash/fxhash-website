import { Dispatch, SetStateAction, useCallback, useMemo, useState } from "react"

interface UserFiltersPayload<Filters extends {}> {
  filters: Filters
  setFilters: Dispatch<SetStateAction<Filters>>
  addFilter: (filter: string, value: any) => void
  removeFilter: (filter: string) => void
}
interface UseFiltersProps<Filters extends {}> {
  defaultFilters?: Filters // filters to add with each return
  initialFilters?: Filters | null
  onRemove?: (removedFilter: string, updatedFilters: Filters) => void
  onAdd?: (addedfilter: string, updatedFilters: Filters) => void
}
export default function useFilters<Filters>(
  props: UseFiltersProps<Filters> = {}
): UserFiltersPayload<Filters> {
  const {
    onAdd,
    onRemove,
    initialFilters,
    defaultFilters: defaultFiltersProp,
  } = props
  const [filters, setFilters] = useState<Filters>(
    initialFilters || ({} as Filters)
  )
  const [defaultFilters] = useState<Filters | undefined>(defaultFiltersProp)

  const addFilter = useCallback(
    (filter: string, value: any) => {
      const updatedFilters = {
        ...filters,
        [filter]: value,
      }
      setFilters(updatedFilters)
      onAdd?.(filter, updatedFilters)
    },
    [filters, onAdd]
  )

  const removeFilter = useCallback(
    (filter: string) => {
      const updatedFilters = {
        ...filters,
        [filter]: undefined,
      }
      setFilters(updatedFilters)
      onRemove?.(filter, updatedFilters)
    },
    [filters, onRemove]
  )

  const withDefaults = useMemo(() => {
    if (defaultFilters) {
      return {
        ...filters,
        ...defaultFilters,
      }
    }
    return filters
  }, [defaultFilters, filters])

  return {
    filters: withDefaults,
    setFilters,
    addFilter,
    removeFilter,
  }
}
