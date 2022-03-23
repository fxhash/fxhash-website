import style from "./InputReactiveSearch.module.scss"
import cs from "classnames"
import { FunctionComponent, useRef, useState } from "react"
import useAsyncEffect from "use-async-effect"



interface Props<ObjectType> {
  value: string
  onChange: (val: string) => void
  // should perform a search given an input
  searchFn: (searchInput: string) => Promise<any>
  // given the output of the searchFn, outputs a list of objects
  transformSearchResults: (results: any) => ObjectType[]
  // given an object, outputs the string to set in the field
  valueFromResult: (result: ObjectType) => string
  // duration of the debounce, in ms
  debounceDuration?: number
  // the children, used to render each item
  children: FunctionComponent<PropsChildren<ObjectType>>
}

interface PropsChildren<ObjectType> {
  item: ObjectType
}

/**
 * The Reactive Search Input component is a generic component to render a text
 * input augmented with search results on keystrokes. It provides a generic
 * interface to:
 *  - get an input and display it within a field
 *  - call a function supposed to output results after each keystroke with
 *    some debounce ofc
 *  - pass the result through a transformer to output a list of items
 *  - display the items in a scrollable area, with each item passed as a prop
 *    to the child of the component using the render props pattern
 */
export function InputReactiveSearch<ObjectType>({
  value,
  onChange,
  searchFn,
  transformSearchResults,
  valueFromResult,
  debounceDuration = 250,
  children,
}: Props<ObjectType>) {
  // keeps the last setTimeout in memory
  const timeout = useRef<number>()

  // will be set when a search is happening
  const [loading, setLoading] = useState<boolean>(false)
  // the items, result of the search
  const [results, setResults] = useState<ObjectType[] | null>(null)

  // an async effect is triggered at each inut change
  useAsyncEffect(async (isMounted) => {
    // if not nullish, clears the timeout
    if (timeout.current != null) {
      window.clearTimeout(timeout.current)
    }
    // sets up the timeout to make call to get results
    timeout.current = window.setTimeout(async () => {
      // start the loading 
      if (isMounted()) {
        setLoading(true)
        // todo: clear items ?
      }
      // make the request to get the results
      const results = await searchFn(value)
      // transforms the results to get a list of items
      const items = transformSearchResults(results)
      // finally update the items in the state
      if (isMounted()) {
        setLoading(false)
        setResults(items)
      }
    }, debounceDuration)
  }, [value])

  return (
    // with the items, map and use children to render
    // <div #wrapper>
    //   {children({ item })}
    // </div>
  )
}