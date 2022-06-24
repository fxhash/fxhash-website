import React, { forwardRef, useEffect, useMemo, useState } from "react";
import { BaseEditor, BaseElement, createEditor, Node, Descendant } from "slate";
import {
  Slate,
  Editable,
  withReact,
  RenderLeafProps,
  ReactEditor,
} from "slate-react"
import { withHistory, HistoryEditor } from "slate-history"
import { TezosStorageProps } from "../elements/TezosStorage"
import { withAutoFormat } from './AutoFormatPlugin/'
import { withImages } from "./ImagePlugin/SlateImagePlugin"
import { ImageElement } from "../elements/ImageElement"
import { renderElements } from "./Elements/RenderElements"
import 'katex/dist/katex.min.css'
  
type TypeElement = BaseElement & { 
  type: string
  children: any 
}

type HeadlineElement = TypeElement & {
  depth: number
}

type ImageElement = TypeElement & {
  title: string   
  url: string
  alt?: string
}

type TezosStorageElement = TypeElement & TezosStorageProps

type CustomElement =  HeadlineElement | TezosStorageElement | ImageElement;

type FormattedText = { 
  text: string
  strong?: boolean
  emphasis?: boolean 
  delete?: boolean
  inlineCode?: boolean
}

type CustomText = FormattedText

declare module 'slate' {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor & HistoryEditor
    Element: CustomElement
    Text: CustomText
  }
}

const renderLeaf = ({ attributes, children, leaf }: RenderLeafProps) => {
  if (leaf.strong) {
    children = <strong>{children}</strong>;
  }
  if (leaf.emphasis) {
    children = <em>{children}</em>;
  }
  if (leaf.delete) {
    children = <del>{children}</del>;
  }
  if (leaf.inlineCode) {
    children = <code>{children}</code>;
  }
  return <span {...attributes}>{children}</span>;
};

interface SlateEditorProps {
  initialValue: Descendant[]
  placeholder?: string
};

const INLINE_ELEMENTS = ['inlineMath', 'link']
const VOID_ELEMENTS = ['inlineMath', 'math']

export const SlateEditor = forwardRef<Node[], SlateEditorProps>(({
  initialValue,
  placeholder,
}, ref) => {
    const editor = useMemo(() => {
      const e = withImages(
        withAutoFormat(
          withHistory(
            withReact(
              createEditor()
            )
          )
        )
      );
      const { isInline, isVoid } = e;
      e.isInline = element => INLINE_ELEMENTS.includes(element.type) || isInline(element)
      e.isVoid = element => VOID_ELEMENTS.includes(element.type) || isVoid(element)
      return e;
    }, []);

    const [value, setValue] = useState<Node[]>(initialValue);
    (ref as React.MutableRefObject<Node[]>).current = value;

    useEffect(() => {
      setValue(initialValue);
    }, [initialValue]);

    return (
      <>
        <div
          className="markdown-body"
          style={{flex:1}}
        >
          <Slate
            editor={editor} 
            value={value} 
            onChange={setValue}
          >
            <Editable
              renderElement={renderElements}
              renderLeaf={renderLeaf}
              placeholder={placeholder}
            />
          </Slate>
        </div>
      </>
    )
  }
)

SlateEditor.displayName = "SlateEditor"


