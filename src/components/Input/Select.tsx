import style from "./Select.module.scss"
import cs from "classnames"
import { InputHTMLAttributes, useMemo, useState } from "react"
import { Cover } from "../Utils/Cover"


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
}

export function Select({
  options,
  value,
  onChange,
  placeholder,
  className,
  ...props
}: Props) {
  const [opened, setOpened] = useState<boolean>(false)

  const selectedOption = useMemo<IOptions>(() => {
    return options.find(opt => opt.value === value) || options[0]
  }, [value])

  const updateValue = (val: any) => {
    onChange(val)
    setOpened(false)
  }

  return (
    <>
      <div className={cs(style.root)}>
        <button 
          className={cs(style.select, className, { [style.opened]: opened })} 
          onClick={() => setOpened(!opened)}
          type="button"
        >
          {placeholder && value === "" ? (
            <>
              <div className={cs(style.placeholder)}>{placeholder}</div>
              <div aria-hidden="true" className={cs(style.sizer)}>{placeholder}</div>
            </>
          ):(
            <div>{selectedOption.label}</div>
          )}
          {options.map((opt, idx) => (
            <div key={idx} aria-hidden="true" className={cs(style.sizer)}>{opt.label}</div>
          ))}
        </button>

        {opened && (
          <div className={cs(style.options)}>
            {options.map((option, idx) => (
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
        )}
      </div>
      {opened && (
        <Cover
          onClick={() => setOpened(false)}
          opacity={0}
          index={10}
        />
      )}
    </>
  )
}