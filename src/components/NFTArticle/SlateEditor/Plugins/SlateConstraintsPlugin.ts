import { Transforms, Node } from "slate";
import { EnhanceEditorWith } from "../../../../types/ArticleEditor/Editor";

/**
 * Adds some constraints to the editor to prevent running into unprocesseable
 * states
 */
export const withConstraints: EnhanceEditorWith = (editor) => {
  const { normalizeNode, insertBreak } = editor

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

    // make sure that the code node has only 1 child
    if (node.type === "code") {
      // if the node has less than 1 child, insert a text node
      if (!node.children || node.children.length === 0) {
        Transforms.insertNodes(
          editor, {
            text: ""
          }, {
            at: path
          }
        )
      }
      // if the node has more than 1 child or children is not text, force text
      else if (node.children.length > 1 || node.children[0].type) {
        Transforms.setNodes(
          editor, {
            children: [{
              text: "",
            }]
          }, {
            at: path
          }
        )
      }
    }
    // normalise links
    if(node.type === 'link') {
      // unwrap links that have no url
      if(node.url === "") {
	Transforms.unwrapNodes(editor, {at: path})
      }
      // remove links that have no text entirly
      if(Node.string(node).length === 0) {
	Transforms.removeNodes(editor, {at: path})
	return;
      }
    }

    normalizeNode(entry)
  }

  return editor
}
