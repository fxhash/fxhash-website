import React, {
  forwardRef,
  KeyboardEvent,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useState
} from "react";
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
import { withImages } from "./Plugins/SlateImagePlugin"
import { ImageElement } from "../elements/ImageElement"
import { onKeyDownHotkeyPlugin } from "./HotkeyPlugin/HotkeyPlugin"
import { RenderElements } from "./Elements/RenderElements"
import 'katex/dist/katex.min.css'
import { withConstraints } from "./Plugins/SlateConstraintsPlugin"
import { IEditorMediaFile } from "../../../types/ArticleEditor/Image";
import { withMediaSupport } from "./Plugins/SlateMediaPlugin";
import { FxEditor } from "../../../types/ArticleEditor/Editor";
import useInit from "../../../hooks/useInit";
import dynamic from 'next/dynamic'


const FloatingInlineMenu = dynamic(() => import('./FloatingInlineMenu/FloatingInlineMenu'), {
  ssr: false,
})
  
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

export type TextFormatKey = 'strong' | 'emphasis' | 'inlineCode';

export type TextFormats = {[key in TextFormatKey]: boolean}

export type FormattedText = {
  text: string
} & TextFormats

type CustomText = FormattedText

declare module 'slate' {
  interface CustomTypes {
    Editor: FxEditor
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
  if (leaf.inlineCode) {
    children = <code>{children}</code>;
  }
  return <span {...attributes}>{children}</span>;
};

interface SlateEditorProps {
  initialValue: Descendant[]
  placeholder?: string
  onMediasUpdate: (medias: IEditorMediaFile[]) => void
  onChange?: (nodes: Descendant[]) => void
  onInit?: (editor: FxEditor) => void
}

const INLINE_ELEMENTS = ['inlineMath', 'link']
const VOID_ELEMENTS = ['inlineMath', 'math']

export const SlateEditor = forwardRef<FxEditor, SlateEditorProps>(({
  initialValue,
  placeholder,
  onMediasUpdate,
  onChange,
  onInit,
}, ref) => {
    const editor = useMemo(() => {
      const e = withConstraints(
        withImages(
          withMediaSupport(
            withAutoFormat(
              withHistory(
                withReact(
                  createEditor()
                )
              )
            ),
            onMediasUpdate
          )
        )
      )
      const { isInline, isVoid } = e;
      e.isInline = element => INLINE_ELEMENTS.includes(element.type) || isInline(element)
      e.isVoid = element => VOID_ELEMENTS.includes(element.type) || isVoid(element)
      return e;
    }, [onMediasUpdate]);

    const [value, setValue] = useState<Node[]>(initialValue);
    const handleChange = useCallback((newValue) => {
      setValue(newValue)
      onChange?.(value)
    }, [onChange])
    // mutate ref to editor whenever editor ref changes
    useImperativeHandle(ref, () => editor, [editor])
    useInit(() => {
      if (onInit) onInit(editor)
    })
    return (
      <>
        <div
          className="markdown-body"
          style={{flex:1}}
        >
          <Slate
            editor={editor}
            value={value}
            onChange={handleChange}
          >
            <Editable
              renderElement={RenderElements}
              renderLeaf={renderLeaf}
              placeholder={placeholder}
              onKeyDown={(event: KeyboardEvent<HTMLDivElement>) => {
                onKeyDownHotkeyPlugin(editor, event)
              }}
            />
	          <FloatingInlineMenu />
          </Slate>
        </div>
      </>
    )
  }
)

SlateEditor.displayName = "SlateEditor"
