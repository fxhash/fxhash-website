import { Editor, Transforms } from "slate";

/**
 * Adds some constraints to the editor to prevent running into unprocesseable
 * states
 */
export const withConstraints = (editor: Editor) => {
  const { normalizeNode } = editor

  editor.normalizeNode = (entry) => {
    const [node, path] = entry

    // if there are no nodes at the root, insert one
    if (path.length === 0) {
      if (editor.children.length < 1) {
        Transforms.insertNodes(editor, {
          type: "paragraph",
          children: [{
            text: ""
          }]
        })
      }
    }

    normalizeNode(entry)
  }

  return editor
}