import style from "./Dropdown.module.scss"
import cs from "classnames"
import {
  MouseEventHandler,
  PropsWithChildren,
  useCallback,
  useState,
} from "react"
import { DropdownMenu } from "./DropdownMenu"
import { useClientEffect } from "../../utils/hookts"

interface Props {
  itemComp: React.ReactNode
  ariaLabel?: string
  className?: string
  btnClassName?: string
  closeOnClick?: boolean
  mobileMenuAbsolute?: boolean
  renderComp?: any
  direction?: "top" | "bottom"
}

export function Dropdown({
  itemComp,
  ariaLabel,
  className,
  btnClassName,
  closeOnClick = true,
  children,
  mobileMenuAbsolute,
  renderComp,
  direction = "bottom",
}: PropsWithChildren<Props>) {
  const [opened, setOpened] = useState<boolean>(false)

  const toggle: MouseEventHandler = useCallback(
    (evt) => {
      evt.preventDefault()
      evt.stopPropagation()
      setOpened(!opened)
    },
    [opened]
  )

  useClientEffect(() => {
    if (opened) {
      const onClick = (evt: any) => {
        if (closeOnClick) {
          setOpened(false)
        } else {
          let close = true
          if (evt.path) {
            for (const el of evt.path) {
              if (el.classList?.contains("dropdown_root")) {
                close = false
                break
              }
            }
            if (close) {
              setOpened(false)
            }
          }
        }
      }
      document.addEventListener("click", onClick)
      return () => {
        document.removeEventListener("click", onClick)
      }
    }
  }, [opened])
  const RenderComponent = renderComp
  return RenderComponent ? (
    <RenderComponent
      btnClassName={btnClassName}
      itemComp={itemComp}
      onToggle={toggle}
      open={opened}
    >
      {children}
    </RenderComponent>
  ) : (
    <div
      className={cs(style.container, "dropdown_root", {
        "avoid-close-event": opened,
        [style.mobile_static_menu]: !mobileMenuAbsolute,
      })}
    >
      <button
        aria-label={ariaLabel}
        onClick={toggle}
        className={cs(style.button, btnClassName, { [style.opened]: opened })}
      >
        {itemComp}
      </button>
      <DropdownMenu direction={direction} opened={opened} className={className}>
        {children}
      </DropdownMenu>
    </div>
  )
}
