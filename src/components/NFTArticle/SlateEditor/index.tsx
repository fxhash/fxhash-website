import React, {
  forwardRef,
  KeyboardEvent,
  useCallback,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react"
import { BaseElement, createEditor, Node, Descendant, Editor } from "slate"
import { Slate, Editable, withReact, RenderLeafProps } from "slate-react"
import { withHistory } from "slate-history"
import { TezosStorageProps } from "../elements/TezosStorage/TezosStorageDisplay"
import { withAutoFormat } from "./Plugins/AutoFormatPlugin/"
import { RenderElements } from "./RenderElements"
import { withConstraints } from "./Plugins/SlateConstraintsPlugin"
import { IEditorMediaFile } from "../../../types/ArticleEditor/Image"
import { withMediaSupport } from "./Plugins/SlateMediaPlugin"
import {
  EnhanceEditorWith,
  FxEditor,
} from "../../../types/ArticleEditor/Editor"
import useInit from "../../../hooks/useInit"
import dynamic from "next/dynamic"
import { onKeyDownTablePlugin, withTables } from "./Plugins/SlateTablePlugin"
import { withBreaks } from "./Plugins/SlateBreaksPlugin"
import {
  FloatingMentionMenu,
  RefFloatingMentionMenu,
} from "../elements/Mention/FloatingMentionMenu"

const FloatingInlineMenu = dynamic(
  () => import("./Plugins/FloatingInlineMenuPlugin/FloatingInlineMenu"),
  {
    ssr: false,
  }
)

type TypeElement = BaseElement & {
  type: string
  children: any
}

type HeadlineElement = TypeElement & {
  depth: number
}

type ImageEditor = TypeElement & {
  title: string
  url: string
  alt?: string
}

type TezosStorageElement = TypeElement & TezosStorageProps

type CustomElement = HeadlineElement | TezosStorageElement | ImageEditor

export const ALL_TEXT_FORMATS = ["strong", "emphasis", "inlineCode"] as const
export type TextFormatKey = typeof ALL_TEXT_FORMATS[number]

export type TextFormats = { [key in TextFormatKey]: boolean }

export type FormattedText = {
  text: string
} & TextFormats

type CustomText = FormattedText

declare module "slate" {
  interface CustomTypes {
    Editor: FxEditor
    Element: CustomElement
    Text: CustomText
  }
}

const renderLeaf = ({ attributes, children, leaf }: RenderLeafProps) => {
  if (leaf.strong) {
    children = <strong>{children}</strong>
  }
  if (leaf.emphasis) {
    children = <em>{children}</em>
  }
  if (leaf.inlineCode) {
    children = <code>{children}</code>
  }
  return <span {...attributes}>{children}</span>
}

interface SlateEditorProps {
  initialValue: Descendant[]
  placeholder?: string
  onMediasUpdate: (medias: IEditorMediaFile[]) => void
  onChange?: (nodes: Descendant[]) => void
  onInit?: (editor: FxEditor) => void
}

const INLINE_ELEMENTS = ["inlineMath", "link", "mention"]
const VOID_ELEMENTS = ["inlineMath", "math", "mention"]

export const SlateEditor = forwardRef<FxEditor, SlateEditorProps>(
  ({ initialValue, placeholder, onMediasUpdate, onChange, onInit }, ref) => {
    const refFloatingMentionMenu = useRef<RefFloatingMentionMenu | null>(null)
    const editor = useMemo(() => {
      const withs: Array<{ f: EnhanceEditorWith; args?: any }> = [
        { f: withReact },
        { f: withHistory },
        { f: withAutoFormat },
        { f: withMediaSupport, args: { onMediasUpdate } },
        { f: withTables },
        { f: withConstraints },
        { f: withBreaks },
      ]
      const enhancedEditor = withs.reduce((e, enhanceWith) => {
        return enhanceWith.f(e, ...Object.values(enhanceWith.args || {}))
      }, createEditor())
      const { isInline, isVoid } = enhancedEditor
      enhancedEditor.isInline = (element) =>
        INLINE_ELEMENTS.includes(element.type) || isInline(element)
      enhancedEditor.isVoid = (element) =>
        VOID_ELEMENTS.includes(element.type) || isVoid(element)
      return enhancedEditor
    }, [onMediasUpdate])

    const [value, setValue] = useState<Node[]>(initialValue)
    const handleChange = useCallback(
      (newValue) => {
        setValue(newValue)
        onChange?.(newValue)
      },
      [onChange]
    )
    const handleKeyDown = useCallback(
      (event: KeyboardEvent<HTMLDivElement>) => {
        onKeyDownTablePlugin(editor, event)
        if (refFloatingMentionMenu.current?.onKeyDown) {
          refFloatingMentionMenu.current.onKeyDown(event)
        }
      },
      [editor]
    )

    // mutate ref to editor whenever editor ref changes
    useImperativeHandle(ref, () => editor, [editor])
    useInit(() => {
      Editor.normalize(editor, { force: true })
      if (onInit) onInit(editor)
    })
    return (
      <>
        <div className="markdown-body" style={{ flex: 1 }}>
          <Slate editor={editor} value={value} onChange={handleChange}>
            <Editable
              renderElement={RenderElements}
              renderLeaf={renderLeaf}
              placeholder={placeholder}
              onKeyDown={handleKeyDown}
            />
            <FloatingInlineMenu />
            <FloatingMentionMenu ref={refFloatingMentionMenu} />
          </Slate>
        </div>
      </>
    )
  }
)

SlateEditor.displayName = "SlateEditor"
