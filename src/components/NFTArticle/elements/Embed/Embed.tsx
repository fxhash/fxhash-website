import React, { memo } from 'react';
import { EmbedMediaDisplay } from "./EmbedMediaDisplay";
import EmbedEditor from "./EmbedEditor";

interface EmbedProps {
  href?: string,
  children?: any
  editable?: boolean,
  slateAttributes?: any
  slateElement?: any
}
const Embed = memo(
  ({ children, href, editable, slateAttributes, slateElement }: EmbedProps) =>
  editable ?
    <EmbedEditor
      href={href}
      slateAttributes={slateAttributes}
      slateElement={slateElement}
    >
      {children}
    </EmbedEditor> :
    <>
      {href && <EmbedMediaDisplay href={href}>{children}</EmbedMediaDisplay>}
    </>
);
Embed.displayName = 'Embed';
export default Embed;
