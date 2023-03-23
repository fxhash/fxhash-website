import style from "./ManualProgressAnimated.module.scss"
import cs from "classnames"

interface Props {
  percent: number
  className?: string
}
export const ManualProgressAnimated = ({ percent, className }: Props) => {
  const divStyle = { right: `${100 - (percent >= 100 ? 100 : percent)}%` }
  return (
    <div className={cs(style.container, className)}>
      <div style={divStyle} />
    </div>
  )
}
