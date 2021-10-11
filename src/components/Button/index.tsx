import { HTMLAttributes, PropsWithChildren } from "react"
import style from './Button.module.scss'
import cs from 'classnames'
import { ButtonOrLink } from "./ButtonOrLink"
import React from "react"


interface ButtonProps extends HTMLAttributes<HTMLButtonElement & HTMLAnchorElement> {
  iconComp?: React.ReactNode
  fontSize?: "regular" | "medium" | "large"
  size?: "regular" | "medium" | "large"
  className?: string
  iconSide?: "left" | "right"
  isLink?: boolean
}

export const Button = React.forwardRef<HTMLButtonElement & HTMLAnchorElement, PropsWithChildren<ButtonProps>>(({ 
  iconComp, 
  iconSide = "left",
  fontSize = "medium",
  size = "medium",
  isLink = false,
  className,
  children,
  ...props
}, ref) => {
  return (
    <ButtonOrLink
      ref={ref}
      isLink={isLink}
      className={cs(style.button, style[`font-${fontSize}`], style[`size-${size}`], style[`icon-${iconSide}`], className)}
      {...props}
    >
      {iconComp}
      <span>{ children }</span>
    </ButtonOrLink>
  )
})