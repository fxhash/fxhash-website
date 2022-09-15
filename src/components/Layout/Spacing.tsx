import style from './Spacing.module.scss'
import cs from 'classnames'

type SpacingSize = "none" | "regular" | "small" | "x-small" | "2x-small" | "3x-small" | "8px"
| "large" | "x-large" | "2x-large" | "3x-large" | "4x-large" | "5x-large" | "6x-large"

interface Props {
  size: SpacingSize
  sm?: SpacingSize
}

export function Spacing({ size, sm }: Props) {
  return (
    <hr className={cs(
      style.spacing,
      style[`spacing-${size}`], {
        [style[`sm-spacing-${sm}`]]: !!sm,
      }
    )} />
  )
}
