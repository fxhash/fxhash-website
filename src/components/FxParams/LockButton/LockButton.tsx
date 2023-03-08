import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { BaseButtonProps, IconButton } from "../BaseInput"
import classes from "./LockButton.module.scss"
import { faLock, faLockOpen } from "@fortawesome/free-solid-svg-icons"
import cx from "classnames"
interface LockButtonProps extends BaseButtonProps {
  isLocked?: boolean
  className?: string
}

export function LockButton(props: LockButtonProps) {
  const { isLocked, className, ...rest } = props
  return (
    <IconButton
      color="secondary"
      className={cx(
        classes.lockButton,
        { [classes.isOpen]: !isLocked },
        className
      )}
      {...rest}
    >
      <FontAwesomeIcon icon={isLocked ? faLock : faLockOpen} />
    </IconButton>
  )
}

