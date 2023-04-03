import { useRouter } from "next/router"
import { useState } from "react"
import { useEffectAfterRender } from "./useEffectAfterRender"

export const defaultQueryParamParse = (value: string) =>
  JSON.parse(decodeURIComponent(value))
export const defaultQueryParamSerialize = <T>(value: T) =>
  encodeURIComponent(JSON.stringify(value))

/**
 * hook that creates a stateful value that is synced with a query param -
 * by default it will parse and serialize JSON strings
 */
export const useQueryParam = <T>(
  param: string,
  defaultValue: T,
  parse = defaultQueryParamParse,
  serialize = defaultQueryParamSerialize
) => {
  const router = useRouter()
  const { [param]: paramValue } = router.query as {
    [key: string]: string
  }
  // initialize the value from the query param, or use the default value
  const [value, setValue] = useState(
    paramValue ? parse(paramValue) : defaultValue
  )

  /**
   * check if a param is defined - if it's an array, check if it has any items
   * otherwise, check if it's truthy
   */
  const isParamDefined = (value: T) => {
    if (Array.isArray(value)) return value.length > 0
    return !!value
  }

  // set the query param - if the value is undefined, remove it from the query
  const setQueryParam = (newValue: T) => {
    const { [param]: _, ...rest } = router.query
    router.replace(
      {
        query: {
          ...rest,
          ...(isParamDefined(newValue) ? { [param]: serialize(newValue) } : {}),
        },
      },
      undefined,
      { shallow: true }
    )
  }

  // update the query param when the value changes
  useEffectAfterRender(() => {
    setQueryParam(value)
  }, [value])

  return [value, setValue] as const
}
