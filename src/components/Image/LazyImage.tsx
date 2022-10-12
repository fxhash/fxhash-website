import { useLazyImage } from "../../utils/hookts"
import { useInView } from "react-intersection-observer"

interface LazyImageProps {
  url: string
  alt: string
  onLoad?: () => void | undefined
  onError?: () => void | undefined
}

export function LazyImage({ url, alt, onLoad, onError }: LazyImageProps) {
  const loaded = useLazyImage(url, { onLoad, onError })
  return <>{url && loaded && <img src={url} alt={alt} />}</>
}
