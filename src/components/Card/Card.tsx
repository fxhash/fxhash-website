import style from "./Card.module.scss"
import cs from "classnames"
import { PropsWithChildren, useMemo } from "react"
import { ipfsDisplayUrl } from "../../services/Ipfs"


interface Props {
  thumbnailUri: string|null
}

export function Card({
  thumbnailUri,
  children
}: PropsWithChildren<Props>) {
  const url = useMemo(() => ipfsDisplayUrl(thumbnailUri), [])

  return (
    <div className={cs(style.container)}>
      <div 
        className={cs(style['thumbnail-container'])}
        style={{
          backgroundImage: `url(${url})`
        }}
      >
        {!url && (
          <div className={cs(style.error)}>
            <i aria-hidden className="fas fa-exclamation-circle"/>
            <span>could not load image</span>
          </div>
        )}
      </div>
      <div className={cs(style.content)}>
        { children }
      </div> 
    </div>
  )
}