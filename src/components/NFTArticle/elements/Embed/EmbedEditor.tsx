import React, { memo, useCallback, useState } from 'react';
import style from "./Embed.module.scss";
import { EmbedMediaDisplay, mediaPlayers } from "./EmbedMediaDisplay";
import { InputText } from "../../../Input/InputText";
import { ReactEditor, useSlateStatic } from "slate-react";
import { Transforms } from "slate";

const mediaPlayersSupported = Object.keys(mediaPlayers).join(', ');
export interface EmbedEditorProps {
  href?: string,
  children?: any
  slateAttributes?: any
  slateElement: any
}
const EmbedEditor = memo(({ children, href, slateElement }: EmbedEditorProps) => {
  const editor = useSlateStatic()
  const path = ReactEditor.findPath(editor, slateElement)
  const [url, setUrl] = useState(href);
  const handleChangeInput = useCallback<React.ChangeEventHandler<HTMLInputElement>>((e) => {
    const newUrl = e.target.value
    Transforms.setNodes(editor, { href: newUrl }, {
      at: path
    })
    setUrl(newUrl);
  }, [editor, path])

  return (
    <div contentEditable={false}>
      <InputText
        defaultValue={url}
        onChange={handleChangeInput}
        className={style.input}
        placeholder={`Support URLs from ${mediaPlayersSupported}`}
      />
      {url && <EmbedMediaDisplay href={url} showNotFound>{children}</EmbedMediaDisplay>}
    </div>
  )
});
EmbedEditor.displayName = 'EmbedEditor';
export default EmbedEditor;
