import cs from "classnames"
import { useState } from "react"
import { SearchInput, SearchInputProps } from "./SearchInput"

interface SearchInputControlledProps
  extends Omit<SearchInputProps, "value" | "onChange"> {
  initialValue?: string
}

/**
 * This is a wrapper component that encapsulates the state in which
 * the input value is stored, because the higher order component
 * might not need it at all
 */
export function SearchInputControlled({
  placeholder = "search by artist name, tags, title...",
  onSearch,
  initialValue = "",
  className,
  minimize,
  onMinimize,
  iconPosition,
}: SearchInputControlledProps) {
  const [value, setValue] = useState<string>(initialValue)

  return (
    <SearchInput
      value={value}
      onChange={setValue}
      placeholder={placeholder}
      onSearch={onSearch}
      className={cs(className)}
      minimize={minimize}
      onMinimize={onMinimize}
      iconPosition={iconPosition}
    />
  )
}
