import React, { memo } from "react"
import { Button } from "../Button"
import cs from "classnames"
import style from "./ButtonPaymentCard.module.scss"
import { iconCardWinter } from "../Icons/custom"

interface ButtonPaymentCardProps {
  className?: string
  onClick?: () => void
  hasDropdown?: string
  disabled: boolean
}

const _ButtonPaymentCard = ({
  className,
  onClick,
  disabled,
  hasDropdown,
}: ButtonPaymentCardProps) => {
  return (
    <Button
      type="button"
      size="regular"
      onClick={onClick}
      disabled={disabled}
      color="secondary-inverted"
      title="Pay with your payment card"
      className={cs(style.credit_card_btn, className)}
      classNameChildren={style.credit_card_btn_children}
    >
      <i className={style.icon_winter} aria-hidden>
        {iconCardWinter}
      </i>
      {hasDropdown && (
        <i
          aria-hidden
          className={cs(`fas fa-caret-down`, style.caret)}
          style={{
            transform: hasDropdown === "up" ? "rotate(180deg)" : "none",
          }}
        />
      )}
    </Button>
  )
}

export const ButtonPaymentCard = memo(_ButtonPaymentCard)
