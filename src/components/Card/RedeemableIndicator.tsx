import cs from "classnames"
import { Icon, TIcon } from "components/Icons/Icon"
import text from "styles/Text.module.css"
import { HoverTitle } from "components/Utils/HoverTitle"
import { Objkt } from "types/entities/Objkt"
import colors from "styles/Colors.module.css"

interface RedeemableIndicatorProps {
  objkt: Objkt
  enableHover?: boolean
  showLabel?: boolean
}

interface ContentProps {
  showLabel: boolean
  icon: TIcon
  label: string
  color: string
}

const Content = ({ showLabel, icon, label, color }: ContentProps) => (
  <span className={cs(text.small, colors[color])}>
    <Icon icon={icon} /> {showLabel && label}
  </span>
)

export const RedeemableIndicator = ({
  objkt,
  enableHover = true,
  showLabel = false,
}: RedeemableIndicatorProps) => {
  const isRedeemable = objkt.availableRedeemables.length > 0
  const icon = isRedeemable ? "sparkles" : "sparkle"
  const label = isRedeemable ? "Redeemable" : "Redeemed"
  const message = isRedeemable ? "Redeemable" : "This token has been redeemed"
  const color = isRedeemable ? "gray" : "gray-light"

  const content = (
    <Content showLabel={showLabel} icon={icon} label={label} color={color} />
  )

  return enableHover ? (
    <HoverTitle message={message}>{content}</HoverTitle>
  ) : (
    content
  )
}
