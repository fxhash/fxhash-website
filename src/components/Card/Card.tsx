import style from "./Card.module.scss"
import cs from "classnames"
import { PropsWithChildren, useMemo, useState } from "react"
import { ipfsDisplayUrl } from "../../services/Ipfs"
import { useClientAsyncEffect } from "../../utils/hookts"
import { Loader } from "../Utils/Loader"
import { useInView } from "react-intersection-observer"


interface Props {
  thumbnailUri: string|null|undefined
}

export function Card({
  thumbnailUri,
  children
}: PropsWithChildren<Props>) {
  const [loaded, setLoaded] = useState<string|null>(null)
  const url = useMemo(() => ipfsDisplayUrl(thumbnailUri), [])
  const { ref, inView } = useInView()

  // lazy load the image
  useClientAsyncEffect(isMounted => {
    if (inView && !loaded && url) {
      const img = new Image()
      img.onload = () => {
        if (isMounted()) {
          setLoaded(url)
        }
      }
      img.src = url
    }
  }, [inView])

  return (
    <div className={cs(style.container)} ref={ref}>
      <div 
        className={cs(style['thumbnail-container'])}
        style={{
          backgroundImage: loaded ? `url(${loaded})` : "none"
        }}
      >
        {!loaded && (
          <div className={cs(style.loader)}>
            <Loader color="white" />
          </div>
        )}
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