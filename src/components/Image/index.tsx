import { useCallback, useRef, useState } from "react"
import { ipfsCidFromUriOrCid } from "../../services/Ipfs"
import { MediaImage } from "../../types/entities/MediaImage"
import { useClientEffect, useLazyImage } from "../../utils/hookts"
import { useInView } from "react-intersection-observer"

const getImageApiUrl = (ipfsUri: string, width: number, height: number) =>
  `${
    process.env.NEXT_PUBLIC_API_MEDIA_ROOT
  }/w_${width},h_${height}/${ipfsCidFromUriOrCid(ipfsUri)}`

interface ContainerSize {
  width: number
  height: number
}

export interface FxImageProps {
  image?: MediaImage
  alt: string
  ipfsUri: string | null | undefined
  style?: {}
  onLoadingComplete?: () => void
  onError?: () => void
  className?: string
}

export function Image(props: FxImageProps) {
  const { image, alt, ipfsUri, onLoadingComplete, onError, style, ...restProps } =
    props
  const ref = useRef<HTMLImageElement>(null)
  const [containerSize, setContainerSize] = useState<ContainerSize | null>(null)
  const [loadedUrl, setLoadedUrl] = useState<string | null>(null)

  const updateContainerSize = useCallback(() => {
    if (!ref.current?.parentNode) return
    const { width, height } = (
      ref.current.parentNode as HTMLElement
    ).getBoundingClientRect()
    setContainerSize({ width: Math.ceil(width), height: Math.ceil(height) })
  }, [ref])

  useClientEffect(() => {
    updateContainerSize()
  }, [ref])

  useClientEffect(() => {
    if (!containerSize || !ipfsUri) return
    const { width, height } = image || {
      width: containerSize.width,
      height: containerSize.height,
    }
    const ratio = width > height ? width / height : height / width
    const url = getImageApiUrl(
      ipfsUri,
      containerSize.width,
      containerSize.width * ratio
    )
    const img = new global.Image()
    img.onload = () => {
      setLoadedUrl(url)
      onLoadingComplete?.()
    }
    img.onerror = () => {
      onError?.()
    }
    img.src = url
  }, [containerSize, ipfsUri, image])

  return (
    <img
      ref={ref}
      src={loadedUrl || image?.placeholder}
      alt={alt}
      width="100%"
      height="100%"
      style={{
        objectFit: "contain",
        ...style,
      }}
      {...restProps}
    />
  )
}
