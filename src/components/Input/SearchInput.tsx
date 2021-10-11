import style from "./SearchInput.module.scss"
import effects from "../../styles/Effects.module.scss"
import cs from "classnames"
import { FormEvent } from "react"


interface Props {
  placeholder: string
  value: string
  className?: string
  onChange: (value: string) => void
  onSearch: (value: string) => void
}

export function SearchInput({
  placeholder,
  value,
  onSearch,
  className,
  onChange
}: Props) {
  const submit = (event: FormEvent<HTMLFormElement> ) => {
    event.preventDefault()
    onSearch(value)
  }

  return (
    <form className={cs(style.search, effects['drop-shadow-small'], className)} onSubmit={submit}>
      <button type="submit" className={cs(style['search-icon'])}><i aria-hidden className="fas fa-search"/></button>
      <input 
        type="text" 
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
      />
    </form>
  )
}