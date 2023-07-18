import cs from "classnames"
import { IReserveConsumption } from "../../services/contract-operations/Mint"
import style from "./MintButton.module.scss"

interface ReserveDropdownProps {
  className?: string
  reserveConsumptionMethod: IReserveConsumption | null
  placement?: "top" | "bottom"
  hideDropdown: () => void
  onMint: (reserveConsumption: IReserveConsumption | null) => void
}

export const ReserveDropdown = ({
  className,
  reserveConsumptionMethod,
  placement = "top",
  hideDropdown,
  onMint,
}: ReserveDropdownProps) => (
  <div
    className={cs(className, style.dropdown, {
      [style.top]: placement === "top",
    })}
  >
    <button
      type="button"
      onClick={() => {
        hideDropdown()
        onMint(reserveConsumptionMethod)
      }}
    >
      using your reserve
    </button>
    <button
      type="button"
      onClick={() => {
        hideDropdown()
        onMint(null)
      }}
    >
      without reserve
    </button>
  </div>
)
