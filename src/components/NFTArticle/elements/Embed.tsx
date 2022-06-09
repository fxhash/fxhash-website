import React, { memo, NamedExoticComponent, useMemo } from 'react';
import EmbedSpotify from "./EmbedSpotify";
import EmbedYoutube from "./EmbedYoutube";
import { NFTArticleElementComponent } from "../../../types/Article";
import { getYoutubeCodeFromUrl } from "../../../utils/embed";

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
const urlPlayers: UrlPlayers = {
  spotify: {
    check: (href) => href.startsWith('https://open.spotify.com/'),
    component: EmbedSpotify,
  },
  youtube: {
    check: (href) => !!getYoutubeCodeFromUrl(href),
    component: EmbedYoutube,
  }
}
interface EmbedProps {
  href: string,
  children?: any
}

const Embed: NFTArticleElementComponent<EmbedProps> = memo(({ children, href }) => {
  const EmbedElement = useMemo(() => {
    const player = Object.values(urlPlayers).find(player => {
      return player.check(href);
    });
    return player?.component;
  }, [href]);
  if (EmbedElement) {
    return <EmbedElement href={href} caption={children} />
  }
  return (
    <a href={href} target="_blank" rel="noreferrer noopener">{children}</a>
  );
});
Embed.displayName = 'Embed';
export default Embed;

Embed.getPropsFromNode = (node, properties) => {
  if (!properties.href) return null;
  return ({
    href: properties.href
  })
}
Embed.htmlTagName = 'embed-media';
