import { ReactNode, useState } from "react"
import cs from "classnames"
import style from "./Collapsible.module.scss"

interface CollapsibleProps {
  disabled?: boolean
  header: ReactNode
  children: ReactNode
}

export const Collapsible: React.FC<CollapsibleProps> = ({
  disabled = false,
  header,
  children,
}) => {
  const [collapsed, setCollapsed] = useState(false)
  const toggle = () => setCollapsed(!collapsed)

  if (disabled)
    return (
      <div>
        {header}
        {children}
      </div>
    )

  return (
    <>
      <div className={style.container} onClick={toggle}>
        {header}
        <i
          className={cs("fa-sharp fa-regular", {
            ["fa-chevron-up"]: !collapsed,
            ["fa-chevron-down"]: collapsed,
          })}
        />
      </div>
      {!collapsed ? (
        children
      ) : (
        <div className={style.show_more} onClick={toggle}>
          show more
        </div>
      )}
    </>
  )
}
