import 'katex/dist/katex.min.css'
import React, {
  forwardRef,
  KeyboardEvent,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useState
} from "react";
import { BaseElement, createEditor, Node, Descendant } from "slate";
import {
  Slate,
  Editable,
  withReact,
  RenderLeafProps,
} from "slate-react"
import { withHistory } from "slate-history"
import { TezosStorageProps } from "../elements/TezosStorage"
import { withAutoFormat } from './AutoFormatPlugin/'
import { withImages } from "./Plugins/SlateImagePlugin"
import { ImageElement } from "../elements/ImageElement"
import { onKeyDownHotkeyPlugin } from "./HotkeyPlugin/HotkeyPlugin"
import { RenderElements } from "./Elements/RenderElements"
import { withConstraints } from "./Plugins/SlateConstraintsPlugin"
import { IEditorMediaFile } from "../../../types/ArticleEditor/Image";
import { withMediaSupport } from "./Plugins/SlateMediaPlugin";
import { EnhanceEditorWith, FxEditor } from "../../../types/ArticleEditor/Editor";
import useInit from "../../../hooks/useInit";
import dynamic from 'next/dynamic'
import { onKeyDownTablePlugin, withTables } from "./Plugins/SlateTablePlugin";


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



export const ALL_TEXT_FORMATS  = ['strong', 'emphasis', 'inlineCode'] as const
export type TextFormatKey = typeof ALL_TEXT_FORMATS[number]

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
    const withs: Array<{ f: EnhanceEditorWith, args?: any }> = [
      { f: withReact },
      { f: withHistory },
      { f: withAutoFormat },
      { f: withMediaSupport, args: { onMediasUpdate } },
      { f: withImages },
      { f: withTables },
      { f: withConstraints },
    ]
    const enhancedEditor = withs.reduce((e, enhanceWith) => {
      return enhanceWith.f(e, ...Object.values(enhanceWith.args || {}));
    }, createEditor());
    const { isInline, isVoid } = enhancedEditor;
    enhancedEditor.isInline = element => INLINE_ELEMENTS.includes(element.type) || isInline(element)
    enhancedEditor.isVoid = element => VOID_ELEMENTS.includes(element.type) || isVoid(element)
    return enhancedEditor;
  }, [onMediasUpdate]);

  const [value, setValue] = useState<Node[]>(initialValue);
  const handleChange = useCallback((newValue) => {
    setValue(newValue)
    onChange?.(newValue)
  }, [onChange])
  const handleKeyDown = useCallback((event: KeyboardEvent<HTMLDivElement>) => {
    onKeyDownHotkeyPlugin(editor, event)
    onKeyDownTablePlugin(editor, event)
  }, [editor])

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
            onKeyDown={handleKeyDown}
          />
          <FloatingInlineMenu />
        </Slate>
      </div>
    </>
  )
})

SlateEditor.displayName = "SlateEditor"
