import { Dispatch, SetStateAction, useCallback, useState } from "react";

interface UserFiltersPayload<Filters> {
  filters: Filters | object
  setFilters: Dispatch<SetStateAction<object | Filters>>,
  addFilter: (filter: string, value: any) => void,
  removeFilter: (filter: string) => void,
}
interface UseFiltersProps {
  onRemove?: (filter: string) => void,
}
export default function useFilters<Filters>(props: UseFiltersProps = {}): UserFiltersPayload<Filters> {
  const { onRemove } = props;
  const [filters, setFilters] = useState<Filters | object>({})

  const addFilter = useCallback((filter: string, value: any) => {
    setFilters({
      ...filters,
      [filter]: value
    })
  }, [filters])

  const removeFilter = useCallback((filter: string) => {
    addFilter(filter, undefined)
    if (onRemove) {
      onRemove(filter);
    }
  }, [addFilter, onRemove])

  return {
    filters,
    setFilters,
    addFilter,
    removeFilter,
  };
}
