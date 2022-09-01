import { Editor, Element, NodeEntry, Range, Transforms } from "slate";
import { EnhanceEditorWith, FxEditor } from "../../../../types/ArticleEditor/Editor";
import { getArticleBlockDefinition } from "../Blocks";

const removeFollowingBlock = (
  editor: FxEditor,
  currentChildrenIdx: number,
  followingNode: NodeEntry<Element> | undefined,
  isPrevious: boolean
): boolean => {
  if (followingNode && followingNode[1].length > 0) {
    const [followingElement, followingPath] = followingNode;
    if (followingElement) {
      const blockDefinition = getArticleBlockDefinition(followingElement.type);
      if (blockDefinition?.hasDeleteBehaviorRemoveBlock && followingPath[0] !== currentChildrenIdx) {
        Transforms.delete(editor, { at: followingPath, hanging: true, reverse: isPrevious })
        return true;
      }
    }
  }
  return false;
}

/**
 * Adds some constraints to the editor to prevent running into unprocesseable
 * states
 */
export const withConstraints: EnhanceEditorWith = (editor) => {
  const { normalizeNode, deleteBackward, deleteForward } = editor

  /**
   * Editor remove the previous children node if enabled
   */
  editor.deleteBackward = (unit) => {
    const { selection } = editor
    if (selection && Range.isCollapsed(selection)) {
      const currentNodeHighestIdx = selection.anchor?.path[0] || 0;
      const prevNode = Editor.previous<Element>(editor, {
        at: selection,
        mode: 'highest',
        match: (n) => !Editor.isEditor(n) && Element.isElement(n)
      })
      if (removeFollowingBlock(editor, currentNodeHighestIdx, prevNode, true)) {
        return;
      }
    }
    deleteBackward(unit);
  }

  /**
   * Editor remove the next children node if enabled
   */
  editor.deleteForward = (unit) => {
    const { selection } = editor
    if (selection && Range.isCollapsed(selection)) {
      const currentNodeHighestIdx = selection.anchor?.path[0] || 0;
      const nextNode = Editor.next<Element>(editor, {
        at: selection,
        mode: 'highest',
        match: (n) => !Editor.isEditor(n) && Element.isElement(n)
      })
      if (removeFollowingBlock(editor, currentNodeHighestIdx, nextNode, false)) {
        return;
      }
    }
    deleteForward(unit);
  }

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

    normalizeNode(entry)
  }

  return editor
}
