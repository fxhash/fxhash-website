import style from "./CodeEditorElement.module.scss"
import cs from "classnames"
import { PropsWithChildren, useCallback, useMemo, useRef, useState } from "react"
import Editor from "react-simple-code-editor"
import { highlight, languages } from "prismjs"
import "prismjs/components/prism-clike"
import "prismjs/components/prism-javascript"
import "prismjs/components/prism-css"
import "prismjs/components/prism-c"
import "prismjs/components/prism-glsl"
import "prismjs/components/prism-markdown"
import "prismjs/components/prism-json"
import "prismjs/components/prism-java"
import { ReactEditor, useSlateStatic } from "slate-react"
import { Node, Transforms } from "slate"
import { getCodeEditorLang } from "./AttributeSettings/CodeAttributeSettings"

interface Props {
  attributes: any
  element: any
}
export function CodeEditorElement({
  attributes,
  element,
  children,
}: PropsWithChildren<Props>) {
  // get editor and path to the node
  const editor = useSlateStatic()
  const nodePath = ReactEditor.findPath(editor, element)

  // we edit the text locally, and initialize with current value
  const [value, setValue] = useState<string>(
    Node.string(element)
  )

  // update the value in the state & update the node too
  const update = (val: string) => {
    setValue(val)
    const path = [...nodePath, 0]
    Transforms.insertText(editor, val, {
      at: path,
      voids: true
    })
  }

  // the language entry corresponding to the value
  const lang = useMemo(() => getCodeEditorLang(element.lang), [element.lang])

  return (
    <div {...attributes} className={cs(style.root)}>
      <div className={cs(style.hidden)}>
        {children}
      </div>
      <span contentEditable={false} className={cs(style.lang)}>
        {lang.name}
      </span>
      <div
        contentEditable={false}
        className={cs(style.code)}
      >
        <Editor
          // @ts-ignore
          highlight={code => highlight(code, languages[element.lang || "js"])}
          value={value}
          onValueChange={update}
          padding={15}
        />
      </div>
    </div>
  )
}