import { ArtworkFrame } from "./ArtworkFrame"
import { Image } from "../Image"
import { LazyImage } from "../Image/LazyImage"
import { MediaImage } from "../../types/entities/MediaImage"

interface Props {
  image?: MediaImage
  ipfsUri?: string
  url?: string
  alt?: string
  loading?: string | boolean
}

export function ArtworkPreview({
  image,
  ipfsUri,
  url,
  alt = "Generative Token preview",
}: Props) {
  return (
    <ArtworkFrame>
      {url ? (
        <LazyImage url={url} alt={alt} />
      ) : (
        <Image image={image} ipfsUri={ipfsUri} alt={alt} />
      )}
    </ArtworkFrame>
  )
}
