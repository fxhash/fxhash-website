import style from "./ConnectedList.module.scss"
import cs from "classnames"
import { Fragment, FunctionComponent } from "react"

interface IChildrenProps<Item> {
  item: Item
}

interface Props<Item> {
  items: Item[]
  children: FunctionComponent<IChildrenProps<Item>>
}
export function ConnectedList<Item = any>({ items, children }: Props<Item>) {
  return (
    <div
      className={cs(style.items, {
        [style.single_item]: items.length === 1,
        [style.more_2_item]: items.length > 2,
      })}
    >
      {items.map((item, idx) => (
        <Fragment key={idx}>{children({ item })}</Fragment>
      ))}
    </div>
  )
}
