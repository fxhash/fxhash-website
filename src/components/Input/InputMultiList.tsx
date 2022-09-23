import style from "./InputMultiList.module.scss"
import cs from "classnames"
import { FunctionComponent } from "react"
import { arrayRemove } from "../../utils/array"

interface MultiListLocalItemProps {
  selected: boolean
  itemProps: any
}

export type MultiListItemProps = Record<string, any> & MultiListLocalItemProps

export interface MultiListItem {
  value: any
  props: Record<string, any>
}

interface Props<ItemType> {
  listItems: MultiListItem[]
  selected: ItemType[]
  onChangeSelected: (selected: ItemType[]) => void
  className?: string
  btnClassName?: string
  multiple?: boolean
  placeholder?: string
  children: FunctionComponent<MultiListItemProps>
}
export function InputMultiList<ItemType = any>({
  listItems,
  selected,
  multiple = true,
  onChangeSelected,
  className,
  btnClassName,
  placeholder,
  children,
}: Props<ItemType>) {
  const itemClicked = (item: MultiListItem) => {
    if (selected.includes(item.value)) {
      onChangeSelected(arrayRemove([...selected], item.value))
    } else {
      onChangeSelected(multiple ? [...selected, item.value] : [item.value])
    }
  }

  return (
    <div className={cs(style.root, className)}>
      {placeholder && listItems.length === 0 && (
        <div className={cs(style.placeholder)}>{placeholder}</div>
      )}
      {listItems.map((item) => (
        <button
          key={item.value}
          type="button"
          className={cs(
            style.item,
            { [style.selected]: selected.includes(item.value) },
            btnClassName
          )}
          onClick={() => itemClicked(item)}
        >
          {children({
            itemProps: item.props,
            selected: selected.includes(item.value),
          })}
          <div className={cs(style.circle)} />
        </button>
      ))}
    </div>
  )
}
