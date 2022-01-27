import style from "./InputMultiList.module.scss"
import cs from "classnames"
import { FunctionComponent } from "react"
import { arrayRemove } from "../../utils/array"


interface MultiListLocalItemProps {
  selected: boolean
  itemProps: any
}

type MultiListItemProps = Record<string, any> & MultiListLocalItemProps

export interface MultiListItem {
  value: any
  props: Record<string, any>
}

interface Props {
  listItems: MultiListItem[]
  selected: any[]
  onChangeSelected: (selected: any[]) => void
  className?: string
  btnClassName?: string
  children: FunctionComponent<MultiListItemProps>
}
export function InputMultiList({
  listItems,
  selected,
  onChangeSelected,
  className,
  btnClassName,
  children,
}: Props) {

  const itemClicked = (item: MultiListItem) => {
    if (selected.includes(item.value)) {
      onChangeSelected(arrayRemove([...selected], item.value))
    }
    else {
      onChangeSelected([ ...selected, item.value ])
    }
  }

  return (
    <div className={cs(style.root, className)}>
      {listItems.map(item => (
        <button 
          key={item.value}
          className={cs(style.item, { [style.selected]: selected.includes(item.value) }, btnClassName)}
          onClick={() => itemClicked(item)}
        >
          {children({
            itemProps: item.props,
            selected: selected.includes(item.value),
          })}
          <div className={cs(style.circle)}/>
        </button>
      ))}
    </div>
  )
}