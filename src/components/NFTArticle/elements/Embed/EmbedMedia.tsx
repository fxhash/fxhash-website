import React, { memo, NamedExoticComponent, useMemo } from 'react';
import EmbedSpotify from "./EmbedSpotify";
import EmbedYoutube from "./EmbedYoutube";
import style from "./Embed.module.scss";
import { getYoutubeCodeFromUrl } from "../../../../utils/embed";

export interface EmbedElementProps {
  href: string
  caption?: string
}
interface UrlPlayers {
  [key: string]: {
    check: (href: string) => boolean,
    component: NamedExoticComponent<EmbedElementProps>,
  }
}
export const mediaPlayers: UrlPlayers = {
  spotify: {
    check: (href) => href.startsWith('https://open.spotify.com/'),
    component: EmbedSpotify,
  },
  youtube: {
    check: (href) => !!getYoutubeCodeFromUrl(href),
    component: EmbedYoutube,
  }
}

interface EmbedMediaProps {
  href: string,
  showNotFound?: boolean
  children?: any
}
const _EmbedMedia = ({ href, children, showNotFound }: EmbedMediaProps) => {
  const EmbedMediaElement = useMemo(() => {
    const player = Object.values(mediaPlayers).find(player => {
      return player.check(href);
    });
    return player?.component;
  }, [href]);
  return EmbedMediaElement ?
    <EmbedMediaElement href={href} caption={children} />
    : <>
        {showNotFound ?
          <p contentEditable={false} className={style.not_found}>
            No embed player found for <a href={href} target="_blank" rel="noreferrer noopener">{href}</a>
          </p>

          : <a href={href} target="_blank" rel="noreferrer noopener">{children}</a>}
      </>
}

export const EmbedMedia = memo(_EmbedMedia);
