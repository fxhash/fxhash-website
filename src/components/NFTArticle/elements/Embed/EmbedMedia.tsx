import React, { memo, NamedExoticComponent, useMemo } from 'react';
import cs from "classnames"
import EmbedSpotify from "./EmbedSpotify";
import EmbedYoutube from "./EmbedYoutube";
import EmbedTwitter from "./EmbedTwitter";
import style from "./Embed.module.scss";
import text from "../../../../styles/Text.module.css"
import { getTweetIdFromUrl, getYoutubeCodeFromUrl } from "../../../../utils/embed";

export interface EmbedElementProps {
  href: string
  caption?: string
}
interface UrlPlayer {
  check: (href: string) => boolean,
  component: NamedExoticComponent<EmbedElementProps>,
}
export const mediaPlayers: Record<string, UrlPlayer> = {
  spotify: {
    check: (href) => href.startsWith('https://open.spotify.com/'),
    component: EmbedSpotify,
  },
  youtube: {
    check: (href) => !!getYoutubeCodeFromUrl(href),
    component: EmbedYoutube,
  },
  twitter: {
    check: (href) => !!getTweetIdFromUrl(href),
    component: EmbedTwitter,
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
          <p contentEditable={false} className={cs(style.not_found, text.info)}>
            No embed player found for <a href={href} target="_blank" rel="noreferrer noopener">{href}</a>
          </p>

          : <a href={href} target="_blank" rel="noreferrer noopener">{children}</a>}
      </>
}

export const EmbedMedia = memo(_EmbedMedia);
