import React, { memo, useContext } from "react"
import { Button } from "../Button"
import cs from "classnames"
import style from "./ButtonPaymentCard.module.scss"
import { iconCardWinter } from "../Icons/custom"
import { UserContext } from "containers/UserProvider"
import { LiveMintingContext } from "context/LiveMinting"

interface ButtonPaymentCardProps {
  className?: string
  onClick?: () => void
  hasDropdown?: string
  disabled: boolean
  label?: string | null
}

const _ButtonPaymentCard = ({
  className,
  onClick,
  disabled,
  hasDropdown,
  label = null,
}: ButtonPaymentCardProps) => {
  const { paidLiveMinting } = useContext(LiveMintingContext)
  return (
    <Button
      type="button"
      size="custom"
      onClick={onClick}
      disabled={disabled}
      color={paidLiveMinting ? "secondary" : "secondary-inverted"}
      title="Pay with your payment card"
      className={cs(style.credit_card_btn, className)}
      classNameChildren={style.credit_card_btn_children}
    >
      {label && <div className={style.copy}>{label}</div>}
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
