import { HTMLAttributes, PropsWithChildren } from "react"
import style from "./Button.module.scss"
import cs from "classnames"
import { ButtonOrLink } from "./ButtonOrLink"
import React from "react"
import { ButtonHTMLAttributes } from "react"

export type ButtonState = "default" | "loading"
export type ButtonSize =
  | "regular"
  | "medium"
  | "large"
  | "small"
  | "very-small"
  | "very-large"
  | "large-x"
  | "full"
  | "custom"

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  iconComp?: React.ReactNode
  state?: ButtonState
  size?: ButtonSize
  color?:
    | "black"
    | "white"
    | "primary"
    | "secondary"
    | "secondary-inverted"
    | "transparent"
  className?: string
  classNameChildren?: string
  iconSide?: "left" | "right" | null
  isLink?: boolean
  disabled?: boolean
}

export const Button = React.forwardRef<
  HTMLButtonElement & HTMLAnchorElement,
  PropsWithChildren<ButtonProps>
>(
  (
    {
      iconComp,
      state = "default",
      iconSide = "left",
      size = "medium",
      color = "black",
      isLink = false,
      disabled = false,
      className,
      classNameChildren,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <ButtonOrLink
        ref={ref}
        isLink={isLink}
        className={cs(
          style.button,
          style[`size-${size}`],
          style[`icon-${iconSide || "alone"}`],
          style[`color-${color}`],
          style[`state-${state}`],
          className,
          {
            [style.disabled]: disabled,
          }
        )}
        // @ts-ignore
        disabled={disabled}
        {...props}
      >
        <div className={cs(style.btn_content)}>
          {iconComp}
          {children && (
            <span className={cs(style.children, classNameChildren)}>
              {children}
            </span>
          )}
        </div>
      </ButtonOrLink>
    )
  }
)
Button.displayName = "Button"
