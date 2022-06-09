import React, { memo, useMemo } from 'react';
import style from "./Embed.module.scss";
import { EmbedElementProps } from "./Embed";

const EmbedSpotify = memo<EmbedElementProps>(({ href }) => {
  const src = useMemo(() => {
    const [_, path] = href.split("https://open.spotify.com/");
    return path.startsWith('embed') ? href : `https://open.spotify.com/embed/${path}`
  }, [href])
  return (
    <div>
      <iframe
        className={style.spotify}
        src={src} width="660px"
        height="380" frameBorder="0" allowFullScreen
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture">
      </iframe>
    </div>
  );
});
EmbedSpotify.displayName = 'EmbedSpotify';

export default EmbedSpotify;
