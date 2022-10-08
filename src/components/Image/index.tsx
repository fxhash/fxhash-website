/* eslint @next/next/no-img-element: 0 */
import styles from "./Image.module.scss"
import { CSSProperties, ImgHTMLAttributes } from "react"
import { useCallback, useRef, useState } from "react"
import { ipfsCidFromUriOrCid } from "../../services/Ipfs"
import { MediaImage } from "../../types/entities/MediaImage"
import { useClientEffect, useLazyImage } from "../../utils/hookts"
import { useInView } from "react-intersection-observer"
import cx from "classnames"
const getImageApiUrl = (ipfsUri: string, width: number, height: number) =>
  `${
    process.env.NEXT_PUBLIC_API_MEDIA_ROOT
  }/w_${width},h_${height}/${ipfsCidFromUriOrCid(ipfsUri)}`

interface ContainerSize {
  width: number
  height: number
}

export interface FxImageProps
  extends Omit<
    ImgHTMLAttributes<HTMLImageElement>,
    "height" | "width" | "onError"
  > {
  image?: MediaImage
  ipfsUri: string | null | undefined
  onLoadingComplete?: () => void
  onError?: (e: Event | string) => void
  width?: number | null
  height?: number | null
  objectFit?: CSSProperties["objectFit"]
  objectPosition?: CSSProperties["objectPosition"]
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
    width,
    height,
    objectFit = "contain",
    objectPosition = "center",
    className,
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
    const imgWidth = image?.width || containerSize.width
    const imgHeight = image?.height || containerSize.height
    const ratio = Math.max(imgWidth, imgHeight) / Math.min(imgWidth, imgHeight)
    const size = Math.min(containerSize.width, containerSize.height)
    const url = getImageApiUrl(
      ipfsUri,
      (width || size) * window.devicePixelRatio,
      (height || size * ratio) * window.devicePixelRatio
    )
    const img = new global.Image()
    img.onload = () => {
      setLoadedUrl(url)
      onLoadingComplete?.()
    }
    img.onerror = (e) => {
      onError?.(e)
    }
    img.src = url
  }, [containerSize, ipfsUri, image])

  return (
    <img
      ref={ref}
      src={loadedUrl || image?.placeholder}
      alt={alt}
      width={width || "100%"}
      height={height || "100%"}
      style={{
        objectFit,
        objectPosition,
        ...style,
      }}
      className={cx(className, styles.root, { [styles.blur]: !loadedUrl })}
      {...restProps}
    />
  )
}
