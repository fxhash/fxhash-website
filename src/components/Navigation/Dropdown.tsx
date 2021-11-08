import style from "./Dropdown.module.scss"
import cs from "classnames"
import { PropsWithChildren, useState } from "react"
import { DropdownMenu } from "./DropdownMenu"
import { useClientEffect } from "../../utils/hookts"


interface Props {
  itemComp: React.ReactNode
  ariaLabel?: string
}

export function Dropdown({
  itemComp,
  ariaLabel,
  children
}: PropsWithChildren<Props>) {
  const [opened, setOpened] = useState<boolean>(false)

  const toggle = () => {
    setOpened(!opened)
  }

  useClientEffect(() => {
    if (opened) {
      const onClick = (evt: any) => {
          // check if the element is inside the opened area
          if (!evt.classList?.contains("avoid-close-event")) {
            setOpened(false)
          }
      }
      document.addEventListener("click", onClick)
      return () => {
        document.removeEventListener("click", onClick)
      }
    }
  }, [opened])

  return (
    <div className={cs(style.container, {
      "avoid-close-event": opened
    })}>
      <button 
        aria-label={ariaLabel}
        onClick={toggle}
        className={cs(style.button, { [style.opened]: opened })}
      >
        { itemComp }
      </button>
      <DropdownMenu opened={opened}>
        { children }
      </DropdownMenu>
    </div>
  )
}