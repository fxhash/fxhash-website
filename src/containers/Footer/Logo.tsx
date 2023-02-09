import style from "./Logo.module.scss"
import cs from "classnames"

interface Props {}
export function Logo({}: Props) {
  return (
    <div className={cs(style.root)}>
      <img src="/images/logo.svg" alt="fx logo" />
      <span>
        {" "}
        <i className="fa-regular fa-copyright" aria-hidden /> 2022 fxhash
        foundation
      </span>
    </div>
  )
}
