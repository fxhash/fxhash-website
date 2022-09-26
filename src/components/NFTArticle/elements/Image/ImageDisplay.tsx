import { ImagePolymorphic } from "../../../Medias/ImagePolymorphic"

interface Props {
  src: string
  alt: string
}
export function ImageDisplay({ src, alt }: Props) {
  return (
    <figure className="article_image">
      <ImagePolymorphic uri={src} />
      {alt && <figcaption>{alt}</figcaption>}
    </figure>
  )
}
