import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import Slate, { Transforms } from 'slate';
import style from "./BlockKatex.module.scss";
import { ReactEditor, RenderElementProps, useSlateStatic, useSelected } from "slate-react";
import { Katex } from "./Katex";
import TextareaAutosize from "react-textarea-autosize";
import cs from "classnames";
import useClickOutside from "../../../../hooks/useClickOutside";

interface BlockKatexEditorProps {
  slateAttributes: RenderElementProps["attributes"]
  slateElement: Slate.Element
  children: any
}
const _BlockKatexEditor = ({ slateElement }: BlockKatexEditorProps) => {
  const refTextArea = useRef<HTMLTextAreaElement>(null);
  const refContainer = useRef<HTMLDivElement>(null);
  const [isFocused, setIsFocused] = useState(false);
  const editor = useSlateStatic();
  const path = ReactEditor.findPath(editor, slateElement);
  const selected = useSelected();

  const handleClickKatex = useCallback(() => {
    if (isFocused) return;
    setIsFocused(true);
    if (refTextArea.current) {
      const end = refTextArea.current.value.length;
      refTextArea.current.setSelectionRange(end, end);
      refTextArea.current.focus();
    }
  }, [isFocused])
  const handleFocus = useCallback(() => setIsFocused(true), []);
  const handleChange = useCallback<React.ChangeEventHandler<HTMLTextAreaElement>>((e) => {
    const newMath = e.target.value;
    Transforms.setNodes(editor, { math: newMath },{
      at: path
    })
  }, [editor, path])
  useClickOutside(refContainer, () => {
    setTimeout(() => {
      setIsFocused(false);
    }, 100)
  }, !isFocused)
  
  useEffect(() => {
    if(selected) {
      const end = refTextArea.current.value.length;
      refTextArea.current.setSelectionRange(end, end);
      refTextArea.current.focus();
    }
  }, [selected])
  

  const { math } = slateElement;
  return (
    <div contentEditable={false} ref={refContainer}>
      <div
        contentEditable={false}
        className={cs({
          [style.hide]: math && !selected,
        })}
      >
        <TextareaAutosize
          ref={refTextArea}
          className={style.input}
          defaultValue={math}
          onChange={handleChange}
          onFocus={handleFocus}
          minRows={1}
          placeholder="Enter a Latex math formula"
        />
      </div>
      {math &&
        <div
          role="button"
          contentEditable={false}
          onClick={handleClickKatex}
          className={cs({
            [style.container_katex_margin]: isFocused
          }
        )}>
          <Katex>{math}</Katex>
        </div>
      }
    </div>
  );
};

export const BlockKatexEditor = memo(_BlockKatexEditor);
