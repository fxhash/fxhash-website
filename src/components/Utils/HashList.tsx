import style from "./HashList.module.scss"
import effects from "../../styles/Effects.module.scss"
import cs from "classnames"

interface Props {
  hashes: string[]
  onChange: (hashes: string[]) => void
  onHashClick?: (hash: string) => void
  className?: string
  activeHash?: string
}
export function HashList({
  hashes,
  className,
  onChange,
  onHashClick,
  activeHash,
}: Props) {
  const removeHash = (idx: number) => {
    const cleaned = [...hashes]
    cleaned.splice(idx, 1)
    onChange(cleaned)
  }
  return (
    <div className={cs(style.root, className)}>
      {hashes.map((hash, idx) => (
        <div
          key={idx}
          title="Load hash on the right"
          className={cs(style.hash, effects["drop-shadow-small"], {
            [style.active]: hash === activeHash,
          })}
        >
          <span onClick={() => onHashClick?.(hash)}>{hash}</span>
          <button
            type="button"
            className={cs(style.close_btn)}
            onClick={() => removeHash(idx)}
          >
            <i aria-hidden className="fas fa-times" />
          </button>
        </div>
      ))}
    </div>
  )
}
