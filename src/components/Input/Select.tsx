import style from "./Select.module.scss"
import effects from "../../styles/Effects.module.scss"
import cs from "classnames"
import {
  InputHTMLAttributes,
  useMemo,
  useState,
  useRef,
  useEffect,
} from "react"
import { useClientAsyncEffect } from "../../utils/hookts"
import { InputText } from "./InputText"
import type FuzzySearchType from "fuzzy-search"
import useClickOutside from "hooks/useClickOutside"

export interface IOptions {
  label: string
  value: any
  disabled?: boolean
}

interface Props extends InputHTMLAttributes<HTMLSelectElement> {
  options: IOptions[]
  value: any
  onChange: (value: any) => void
  className?: string
  classNameRoot?: string
  search?: boolean
  searchKeys?: string[]
  searchDictionnary?: any[]
  searchValue?: string
}

export function Select({
  options,
  value,
  onChange,
  placeholder,
  className,
  classNameRoot,
  search = false,
  searchKeys,
  searchDictionnary,
  searchValue,
  ...props
}: Props) {
  const selectRef = useRef<HTMLDivElement>(null)
  const [searchString, setSearchString] = useState<string>("")
  const searcherRef = useRef<FuzzySearchType<any> | null>(null)
  const [searchResults, setSearchResults] = useState<IOptions[] | null>(null)

  const searchRef = useRef<HTMLInputElement>(null)
  const [opened, setOpened] = useState<boolean>(false)
  const [direction, setDirection] = useState<"top" | "bottom">("bottom")

  const selectedOption = useMemo<IOptions>(() => {
    return options.find((opt) => opt.value === value) || options[0]
  }, [value])

  const toggleOpened = () => {
    if (!opened && selectRef.current) {
      // set the opening direction
      const bounds = selectRef.current.getBoundingClientRect()
      setDirection(window.innerHeight - bounds.bottom < 250 ? "top" : "bottom")
    }
    setOpened(!opened)
  }

  const updateValue = (val: any) => {
    onChange(val)
    setOpened(false)
  }

  // is search is enabled, load fuse in async
  useClientAsyncEffect(
    async (isMounted) => {
      if (search) {
        const FuzzySearch = (await import("fuzzy-search")).default
        searcherRef.current = new FuzzySearch(
          searchDictionnary || [],
          searchKeys || []
        )
      }
    },
    [search]
  )

  // when the select is opened, focus on the search input
  useEffect(() => {
    if (opened && searchRef.current) {
      searchRef.current.focus()
    }
  }, [opened])

  // when the search string changes, performs a search
  useEffect(() => {
    if (search && searcherRef.current) {
      if (searchString.length > 0) {
        const results = searcherRef.current.search(searchString)
        // find within the options, those who match the search results
        const found: IOptions[] = []
        for (const result of results) {
          const f = options.find(
            (opt) => opt.value === result[searchValue || "value"]
          )
          if (f) found.push(f)
        }
        setSearchResults(found)
      } else {
        setSearchResults(null)
      }
    }
  }, [searchString])

  // what are the options displayed ?
  const displayOptions = searchResults || options

  useClickOutside(selectRef, () => setOpened(false), !opened)

  return (
    <>
      <div
        className={cs(style.root, style[`opening_${direction}`], classNameRoot)}
        ref={selectRef}
      >
        <button
          className={cs(style.select, className, { [style.opened]: opened })}
          onClick={toggleOpened}
          type="button"
        >
          {placeholder && value === "" ? (
            <>
              <div className={cs(style.placeholder)}>{placeholder}</div>
              <div aria-hidden="true" className={cs(style.sizer)}>
                {placeholder}
              </div>
            </>
          ) : (
            <div className={style.value}>{selectedOption.label}</div>
          )}
          {options.map((opt, idx) => (
            <div key={idx} aria-hidden="true" className={cs(style.sizer)}>
              {opt.label}
            </div>
          ))}
        </button>

        {opened && (
          <div
            className={cs(style.options, effects["drop-shadow-big"], {
              [style.has_search]: search,
            })}
          >
            {search && (
              <InputText
                value={searchString}
                onChange={(evt) => setSearchString(evt.target.value)}
                placeholder="Search..."
                ref={searchRef}
                className={cs(style.search, effects["drop-shadow-big"])}
              />
            )}
            <div className={cs(style.options_wrapper)}>
              <div>
                {displayOptions.map((option, idx) => (
                  <button
                    key={idx}
                    className={cs(style.option)}
                    onClick={() => updateValue(option.value)}
                    disabled={option.disabled}
                    type="button"
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
