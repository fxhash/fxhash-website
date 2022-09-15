import { Range, Path, Node, Text, Transforms } from "slate"
import { EnhanceEditorWith } from "../../../../types/ArticleEditor/Editor"

const clipboardEncode = (data: any) =>
  window.btoa(encodeURIComponent(JSON.stringify(data)))
const clipboardDecode = (str: string) =>
  JSON.parse(decodeURIComponent(window.atob(str)))

export const withSimpleCopyPaste: EnhanceEditorWith = (editor) => {
  editor.setFragmentData = (data) => {
    if (!editor.selection || Range.isCollapsed(editor.selection)) return

    const { anchor, focus } = editor.selection

    let commonPath = Path.common(anchor.path, focus.path)
    let commonNode = Node.get(editor, commonPath)

    if (Text.isText(commonNode)) {
      // Node.fragment() demands an Element root
      commonPath = commonPath.slice(0, commonPath.length - 1)
      commonNode = Node.get(editor, commonPath)
    }

    data.setData(
      "application/x-slate-nodes",
      clipboardEncode(
        Node.fragment(commonNode, {
          anchor: { ...anchor, path: anchor.path.slice(commonPath.length) },
          focus: { ...focus, path: focus.path.slice(commonPath.length) },
        })
      )
    )
  }

  editor.insertData = (data) => {
    const encoded = data.getData("application/x-slate-nodes")
    if (encoded !== "") {
      Transforms.insertNodes(editor, clipboardDecode(encoded))
    }
  }

  return editor
}
