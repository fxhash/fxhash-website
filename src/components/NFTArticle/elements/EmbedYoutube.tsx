import React, { memo, useMemo } from 'react';
import style from "./Embed.module.scss";
import { getYoutubeCodeFromUrl } from "../../../utils/embed";
import { EmbedElementProps } from "./Embed";

const EmbedYoutube = memo<EmbedElementProps>(({ href }) => {
  const embedUrl = useMemo(() => {
    const code = getYoutubeCodeFromUrl(href);
    return `https://www.youtube.com/embed/${code}`;
  }, [href]);
  return (
    <div className={style.youtube} contentEditable={false}>
      <iframe
        src={embedUrl}
        title="YouTube video player"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
      >
      </iframe>
    </div>
  );
});
EmbedYoutube.displayName = 'EmbedYoutube';

export default EmbedYoutube;
