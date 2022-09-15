import style from "./CodeEditor.module.scss"
import cs from "classnames"
import { PropsWithChildren, useMemo, useState } from "react"
import Editor from "react-simple-code-editor"
import { highlight, languages } from "prismjs"
import { ReactEditor, useSlateStatic } from "slate-react"
import { Node, Transforms } from "slate"
import { getCodeEditorLang } from "./CodeLanguages"

interface Props {
  attributes: any
  element: any
}
export function CodeEditor({
  attributes,
  element,
  children,
}: PropsWithChildren<Props>) {
  // get editor and path to the node
  const editor = useSlateStatic()
  const nodePath = ReactEditor.findPath(editor, element)

  // we edit the text locally, and initialize with current value
  const [value, setValue] = useState<string>(Node.string(element))

  // update the value in the state & update the node too
  const update = (val: string) => {
    setValue(val)
    const path = [...nodePath, 0]
    Transforms.insertText(editor, val, {
      at: path,
      voids: true,
    })
  }

  // the language entry corresponding to the value
  const lang = useMemo(() => getCodeEditorLang(element.lang), [element.lang])

  return (
    <div {...attributes} className={cs(style.root)}>
      <div className={cs(style.hidden)}>{children}</div>
      <span contentEditable={false} className={cs(style.lang)}>
        {lang.name}
      </span>
      <div contentEditable={false} className={cs(style.code)}>
        <Editor
          // @ts-ignore
          highlight={(code) =>
            highlight(
              code,
              languages[element.lang || "plain"] || languages.plain
            )
          }
          value={value}
          onValueChange={update}
          padding={15}
        />
      </div>
    </div>
  )
}
