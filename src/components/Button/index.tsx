import { HTMLAttributes, PropsWithChildren } from "react"
import style from './Button.module.scss'
import cs from 'classnames'
import { ButtonOrLink } from "./ButtonOrLink"
import React from "react"
import { ButtonHTMLAttributes } from "react"


export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  iconComp?: React.ReactNode
  state?: "default" | "loading"
  size?: "regular" | "medium" | "large" | "small" | "very-large"
  color?: "black" | "primary" | "secondary"
  className?: string
  iconSide?: "left" | "right"
  isLink?: boolean
  disabled?: boolean
}

export const Button = React.forwardRef<HTMLButtonElement & HTMLAnchorElement, PropsWithChildren<ButtonProps>>(({ 
  iconComp, 
  state = "default",
  iconSide = "left",
  size = "medium",
  color = "black",
  isLink = false,
  disabled = false,
  className,
  children,
  ...props
}, ref) => {
  return (
    <ButtonOrLink
      ref={ref}
      isLink={isLink}
      className={cs(
        style.button, 
        style[`size-${size}`],
        style[`icon-${iconSide}`],
        style[`color-${color}`],
        style[`state-${state}`],
        className
      )}
      // @ts-ignore
      disabled={disabled}
      {...props}
    >
      {iconComp}
      <span>{ children }</span>
    </ButtonOrLink>
  )
})