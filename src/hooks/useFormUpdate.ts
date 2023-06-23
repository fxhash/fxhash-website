import { useCallback } from "react"

type UpdateFormObjectFn<T extends {}> = <K extends keyof T>(
  key: K,
  V: T[K]
) => void

export function useUpdateFormObject<T extends {}>(
  value: T,
  onChange: (value: T) => void
): UpdateFormObjectFn<T> {
  return useCallback(
    <K extends keyof T>(key: K, V: T[K]) => {
      onChange({
        ...value,
        [key]: V,
      })
    },
    [value, onChange]
  )
}

export function useUpdateFormArray<T, K = void>(
  value: T[],
  onChange: (value: T[]) => void,
  create?: (input: K) => T
) {
  const add = useCallback(
    (input: K) => {
      if (create) {
        onChange([...value, create(input)])
      }
    },
    [value, onChange, create]
  )

  const del = useCallback(
    (idx: number) => {
      const out = [...value]
      out.splice(idx, 1)
      onChange(out)
    },
    [value, onChange]
  )

  const update = (idx: number, val: T) => {
    const out = [...value]
    out[idx] = val
    onChange(out)
  }

  return { add, del, update }
}

export function useUpdateFormObjectArray<T extends {}, K>(
  value: T[],
  onChange: (value: T[]) => void,
  create?: (input: K) => T
) {
  const add = useCallback(
    (input: K) => {
      if (create) {
        onChange([...value, create(input)])
      }
    },
    [value, onChange, create]
  )

  const del = useCallback(
    (idx: number) => {
      const out = [...value]
      out.splice(idx, 1)
      onChange(out)
    },
    [value, onChange]
  )

  const update = <Key extends keyof T>(idx: number, key: Key, val: T[Key]) => {
    const out = [...value]
    out[idx][key] = val
    onChange(out)
  }

  return {
    add,
    del,
    update,
  }
}
