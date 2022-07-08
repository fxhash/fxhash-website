import React, { memo, useCallback } from 'react';
import Slate, { Transforms } from 'slate';
import style from "./BlockKatex.module.scss";
import { ReactEditor, RenderElementProps, useSlateStatic } from "slate-react";
import { Katex } from "./Katex";
import TextareaAutosize from "react-textarea-autosize";

interface BlockKatexEditorProps {
  slateAttributes: RenderElementProps["attributes"]
  slateElement: Slate.Element
  children: any
}
const _BlockKatexEditor = ({ slateElement }: BlockKatexEditorProps) => {
  const editor = useSlateStatic();
  const path = ReactEditor.findPath(editor, slateElement);
  const handleChange = useCallback<React.ChangeEventHandler<HTMLTextAreaElement>>((e) => {
    const newMath = e.target.value;
    Transforms.setNodes(editor, { math: newMath },{
      at: path
    })
  }, [editor, path])
  const { math } = slateElement;
  return (
    <div contentEditable={false}>
      <TextareaAutosize
        className={style.input}
        defaultValue={math}
        onChange={handleChange}
        minRows={1}
        placeholder="Enter a Latex math formula"
      />
      {math && <Katex>{math}</Katex>}
    </div>
  );
};

export const BlockKatexEditor = memo(_BlockKatexEditor);
