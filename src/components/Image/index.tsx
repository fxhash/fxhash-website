/* eslint @next/next/no-img-element: 0 */

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

const SIZE_PRECISION = 50

export function Image(props: FxImageProps) {
  const {
    image,
    alt,
    ipfsUri,
    onLoadingComplete,
    onError,
    style,
    ...restProps
  } = props
  const ref = useRef<HTMLImageElement>(null)
  const [containerSize, setContainerSize] = useState<ContainerSize | null>(null)
  const [loadedUrl, setLoadedUrl] = useState<string | null>(null)

  const updateContainerSize = useCallback(() => {
    if (!ref.current?.parentNode) return
    const { width, height } = (
      ref.current.parentNode as HTMLElement
    ).getBoundingClientRect()
    const containerWidth = Math.ceil(width / SIZE_PRECISION) * SIZE_PRECISION
    const containerHeight = Math.ceil(height / SIZE_PRECISION) * SIZE_PRECISION
    if (
      !containerSize ||
      containerSize.width < containerWidth ||
      containerSize.height < containerHeight
    ) {
      setContainerSize({ width: containerWidth, height: containerHeight })
    }
  }, [ref, containerSize])

  useClientEffect(() => {
    updateContainerSize()
  }, [ref])

  useClientEffect(() => {
    if (!containerSize || !ipfsUri) return
    const width = image?.width || containerSize.width
    const height = image?.height || containerSize.height
    const ratio = Math.max(width, height) / Math.min(width, height)
    const url = getImageApiUrl(
      ipfsUri,
      containerSize.width * window.devicePixelRatio,
      containerSize.width * ratio * window.devicePixelRatio
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
