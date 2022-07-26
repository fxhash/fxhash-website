import React, { memo } from 'react';
import { NFTArticleElementComponent } from "../../../../types/Article";
import { EmbedMedia } from "./EmbedMedia";
import EmbedEditor from "./EmbedEditor";

interface EmbedProps {
  href?: string,
  children?: any
  editable?: boolean,
  slateAttributes?: any
  slateElement?: any
}
const Embed: NFTArticleElementComponent<EmbedProps> = memo(
  ({ children, href, editable, slateAttributes, slateElement }) =>
  editable ?
    <EmbedEditor
      href={href}
      slateAttributes={slateAttributes}
      slateElement={slateElement}
    >
      {children}
    </EmbedEditor> :
    <>
      {href && <EmbedMedia href={href}>{children}</EmbedMedia>}
    </>
);
Embed.displayName = 'Embed';
export default Embed;

Embed.getPropsFromNode = (node, properties) => {
  if (!properties.href) return null;
  return ({
    href: properties.href,
    editable: false,
  })
}
Embed.htmlTagName = 'embed-media';
Embed.fromSlateToMarkdown = properties => {
  if (!properties.href) return null;
  return ({
    href: properties.href
  })
}
