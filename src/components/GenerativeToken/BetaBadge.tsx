import style from "./BetaBadge.module.scss"
import cx from 'classnames';

interface Props {
  className: GenerativeToken,
  size: "small" | "default"
}

export function BetaBadge({
  className,
  size="small"
} : Props) {

  return (
    <div className={cx(className, style.beta_badge, style[`size_${size}`])}>
      <i className={"fa-solid fa-badge"} />
      <span className={style.beta_icon}>&beta;</span>
    </div>
  );
}

