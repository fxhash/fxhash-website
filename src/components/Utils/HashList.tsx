import style from "./HashList.module.scss"
import effects from "../../styles/Effects.module.scss"
import cs from "classnames"
import { truncateMiddle } from "utils/strings"

interface Props {
  hashes: string[]
  params?: string[] | null
  onChange: (hashes: string[], params?: string[]) => void
  onHashClick?: (hash: string, param?: string) => void
  className?: string
  activeHash?: string
}
export function HashList({
  hashes,
  params,
  className,
  onChange,
  onHashClick,
  activeHash,
}: Props) {
  const removeItem = (idx: number) => {
    const cleanedHashes = [...hashes]
    cleanedHashes.splice(idx, 1)
    let cleanedParams
    if (params) {
      cleanedParams = [...params]
      cleanedParams.splice(idx, 1)
    }
    onChange(cleanedHashes, cleanedParams)
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
          <span onClick={() => onHashClick?.(hash, params?.[idx])}>
            {hash}
            {params && ` / ${truncateMiddle(params?.[idx] || "", 40)}`}
          </span>
          <button
            type="button"
            className={cs(style.close_btn)}
            onClick={() => removeItem(idx)}
          >
            <i aria-hidden className="fas fa-times" />
          </button>
        </div>
      ))}
    </div>
  )
}
