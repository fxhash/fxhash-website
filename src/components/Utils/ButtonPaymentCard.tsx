import React, { memo } from "react"
import { Button } from "../Button"
import cs from "classnames"
import style from "./ButtonPaymentCard.module.scss"

interface ButtonPaymentCardProps {
  className?: string
  onClick?: () => void
  disabled: boolean
}

const _ButtonPaymentCard = ({
  className,
  onClick,
  disabled,
}: ButtonPaymentCardProps) => {
  return (
    <Button
      type="button"
      size="regular"
      onClick={onClick}
      disabled={disabled}
      color="secondary"
      title="Pay with your payment card"
      className={cs(style.credit_card_btn, className)}
    >
      <i className={cs("fa-sharp fa-solid fa-credit-card")} aria-hidden />
    </Button>
  )
}

export const ButtonPaymentCard = memo(_ButtonPaymentCard)
