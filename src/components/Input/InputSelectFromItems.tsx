import style from "./InputSelectFromItems.module.scss"
import cs from "classnames"
import { FunctionComponent, useEffect, useMemo, useRef, useState } from "react"

interface ChildrenProps<T> {
  item: T
  selected: boolean
}
interface Props<T, K = string> {
  value?: K
  onChange: (value: K) => void
  items: T[]
  getItemValue: (item: T, index: number) => K
  className?: string
  children: FunctionComponent<ChildrenProps<T>>
}
export function InputSelectFromItems<T, K = string>({
  value,
  onChange,
  items,
  getItemValue,
  className,
  children,
}: Props<T, K>) {
  const container = useRef<HTMLDivElement>(null)
  const [opened, setOpened] = useState<boolean>(false)

  // which item is selected
  const selected = useMemo(() => {
    for (let i = 0; i < items.length; i++) {
      const item = items[i]
      if (getItemValue(item, i) === value) {
        return item
      }
    }
    return null
  }, [value, items])

  // can be called to select a new item
  const select = (v: K) => {
    onChange(v)
    setOpened(false)
  }

  // attach an event to the DOM for when the user clicks outside of the select
  useEffect(() => {
    if (opened) {
      const listener = (ev: MouseEvent) => {
        if (!container.current?.contains(ev.target as Node)) {
          setOpened(false)
        }
      }
      document.addEventListener("click", listener)
      return () => document.removeEventListener("click", listener)
    }
  }, [opened])

  return (
    <div ref={container} className={cs(style.root, className)}>
      <button
        type="button"
        onClick={() => setOpened(!opened)}
        className={cs(style.select)}
      >
        {selected ? (
          children({ item: selected, selected: false })
        ) : (
          <div className={cs(style.placeholder)}>Please select...</div>
        )}
      </button>
      {opened && (
        <div className={cs(style.options)}>
          {items.map((item, idx) => {
            const val = getItemValue(item, idx)
            const selected = val === value
            return (
              <button
                key={val as any}
                type="button"
                className={cs(style.option, {
                  [style.selected]: selected,
                })}
                onClick={() => select(val)}
              >
                {children({
                  item: item,
                  selected: selected,
                })}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
