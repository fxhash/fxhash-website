import NextImage, {
  ImageProps as NextImageProps,
  ImageLoaderProps,
  ImageLoader,
} from "next/image"
import { useMemo } from "react"
import { ipfsCidFromUriOrCid } from "../../services/Ipfs"
import { MediaImage } from "../../types/entities/MediaImage"
import { LazyImage } from "./LazyImage"
import { ipfsGatewayUrl } from "../../services/Ipfs"

export interface FxHashImageLoaderFactoryProps {
  ratio: number
}

const fxHashImageLoaderFactory =
  ({ ratio }: FxHashImageLoaderFactoryProps): ImageLoader =>
  ({ src, width }: ImageLoaderProps): string => {
    return `${process.env.NEXT_PUBLIC_API_MEDIA_ROOT}/w_${width},h_${Math.ceil(
      width * ratio
    )}/${ipfsCidFromUriOrCid(src)}`
  }

export interface FxImageProps extends Omit<NextImageProps, "src"> {
  image?: MediaImage
  alt: string
  ipfsUri: string | null | undefined
}

export function Image(props: FxImageProps) {
  const { image, alt, ipfsUri, layout = "responsive", ...restProps } = props
  const loader = useMemo(() => {
    if (!image) return undefined
    const { width, height } = image
    const ratio = width > height ? width / height : height / width
    return fxHashImageLoaderFactory({ ratio })
  }, [image])
  const sizesRequired = layout !== "fill"
  const ipfsUrl = useMemo(() => ipfsGatewayUrl(ipfsUri), [ipfsUri])
  if (!ipfsUri) return null
  if (!image && sizesRequired)
    return (
      <LazyImage
        url={ipfsUri}
        alt={alt}
        {...restProps}
        onLoad={props.onLoadingComplete as () => void}
        onError={props.onError as () => void}
      />
    )
  return (
    <NextImage
      placeholder={image?.placeholder ? "blur" : "empty"}
      height={sizesRequired ? image?.height : undefined}
      width={sizesRequired ? image?.width : undefined}
      blurDataURL={image?.placeholder}
      loader={loader}
      src={loader ? ipfsUri : ipfsUrl}
      alt={alt}
      layout={layout}
      {...restProps}
    />
  )
}
