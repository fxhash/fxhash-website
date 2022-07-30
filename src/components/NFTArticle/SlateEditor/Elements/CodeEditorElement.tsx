import style from "./CodeEditorElement.module.scss"
import cs from "classnames"
import { PropsWithChildren, useCallback, useRef, useState } from "react"
import Editor from "react-simple-code-editor"
import { highlight, languages } from "prismjs"
import 'prismjs/components/prism-clike'
import 'prismjs/components/prism-javascript'
import { ReactEditor, useSlateStatic } from "slate-react"
import { Node, Transforms } from "slate"

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

  return (
    <div {...attributes}>
      <div className={cs(style.hidden)}>
        {children}
      </div>
      <div contentEditable={false}>
        <Editor
          // @ts-ignore
          highlight={code => highlight(code, languages[element.lang || "js"])}
          value={value}
          onValueChange={update}
          className={cs(style.code)}
          padding={10}
        />
      </div>
    </div>
  )
}