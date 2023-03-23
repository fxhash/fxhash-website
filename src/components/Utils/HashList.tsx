import style from "./HashList.module.scss"
import effects from "../../styles/Effects.module.scss"
import cs from "classnames"
import { truncateMiddle } from "utils/strings"

interface Props {
  hashes: string[]
  params?: string[] | null
  onChange: (hashes: string[], params?: string[]) => void
  onClickItem?: (index: number, hash: string, param?: string) => void
  className?: string
  activeItem?: number
  translateInputBytes?: (bytes: string) => string
}
export function HashList({
  hashes,
  params,
  className,
  onChange,
  onClickItem,
  activeItem,
  translateInputBytes,
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
            [style.active]: idx === activeItem,
          })}
        >
          <span onClick={() => onClickItem?.(idx, hash, params?.[idx])}>
            {hash}
            {params && (
              <>
                &nbsp;
                {translateInputBytes
                  ? translateInputBytes(params?.[idx]).toString()
                  : truncateMiddle(params?.[idx] || "", 48)}
              </>
            )}
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
