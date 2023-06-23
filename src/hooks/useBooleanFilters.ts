import { useMemo } from "react"

interface IBooleanFilterDef<T> {
  label: string
  value: keyof T
}

interface UseBooleanFiltersProps<T> {
  booleanFiltersDef: IBooleanFilterDef<T>[]
  filters: T
  setFilters: (filters: T) => void
}

export const useBooleanFilters = <T extends Record<string, any>>({
  booleanFiltersDef,
  filters,
  setFilters,
}: UseBooleanFiltersProps<T>) => {
  // derive booleanFilters (list of strings, each string is property filter)
  const booleanFilters = useMemo(() => {
    const out: string[] = []
    for (const bf of booleanFiltersDef) {
      if (filters[bf.value] === true) {
        out.push(bf.value as string)
      }
    }

    return out
  }, [filters])

  const updateBooleanFilters = (enabledFilters: string[]) => {
    const out: T = {
      ...filters,
    }
    for (const bf of booleanFiltersDef) {
      ;(out[bf.value] as any) = enabledFilters.includes(bf.value as string)
        ? true
        : undefined
    }
    setFilters(out)
  }

  return {
    booleanFilters,
    updateBooleanFilters,
  }
}
