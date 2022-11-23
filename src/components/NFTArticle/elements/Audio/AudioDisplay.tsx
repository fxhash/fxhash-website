import React, { memo } from "react"
import { AudioPolymorphic } from "../../../Medias/AudioPolymorphic"

interface AudioDisplayProps {
  src: string
  children: any
}

const _AudioDisplay = ({ src, children }: AudioDisplayProps) => (
  <figure className="article_audio">
    <AudioPolymorphic controls uri={src} />
    {src && <figcaption>{children}</figcaption>}
  </figure>
)

export const AudioDisplay = memo(_AudioDisplay)
