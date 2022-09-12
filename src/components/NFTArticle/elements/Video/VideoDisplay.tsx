import React, { memo } from 'react';
import { VideoPolymorphic } from "../../../Medias/VideoPolymorphic";

interface VideoDisplayProps {
  src: string
  children: any
}

const _VideoDisplay = ({ src, children }: VideoDisplayProps) => (
  <figure className="article_video">
    <VideoPolymorphic
      uri={src}
      controls
      showLoadingError
    />
    {src && (
      <figcaption>
        {children}
      </figcaption>
    )}
  </figure>
);

export const VideoDisplay = memo(_VideoDisplay);
