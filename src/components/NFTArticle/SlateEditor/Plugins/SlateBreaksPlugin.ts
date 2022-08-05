import { Transforms, Path, NodeEntry, Node } from "slate";
import { EnhanceEditorWith, FxEditor } from "../../../../types/ArticleEditor/Editor";
import { lookupElementAtSelection } from "../utils";
import { getArticleBlockDefinition } from "../Elements/Blocks";

export enum EBreakBehavior {
  "default" = "default",
  "insertParagraph" = "insertParagraph",
  "insertParagraphIfEmpty" = "insertParagraphIfEmpty",
  "nothing" = "nothing",
}

export type ShouldDefaultInsertBreak = boolean;
export type InsertBreakFunction = (editor: FxEditor, element: NodeEntry) => ShouldDefaultInsertBreak | void
export const breakBehaviors: Record<EBreakBehavior, InsertBreakFunction> = {
  default: () => true,
  insertParagraph: (editor, element) => {
    const [, pathEl] = element;
    const pathNextEl = Path.next(pathEl)
    Transforms.splitNodes(editor, { always: true });
    Transforms.setNodes(editor, { type: 'paragraph'}, {
      at: pathNextEl,
    });
  },
  insertParagraphIfEmpty: (editor, element) => {
    const [node] = element;
    const text = Node.string(node);
    if (text) return true;
    breakBehaviors.insertParagraph(editor, element)
  },
  nothing: () => {},
}

/**
 * Manage break behavior of elements
 */
export const withBreaks: EnhanceEditorWith = (editor) => {
  const { insertBreak } = editor

  editor.insertBreak = () => {
    const { selection } = editor;
    const nodeEntry = lookupElementAtSelection(editor, selection);
    if (nodeEntry) {
      const [node] = nodeEntry;
      const definition = getArticleBlockDefinition(node.type);
      const behavior = definition.insertBreakBehavior;
      if (behavior) {
        const insertBreakFunction = typeof behavior === 'function' ? behavior : breakBehaviors[behavior]
        const shouldDefaultInsertBreak = insertBreakFunction(editor, nodeEntry);
        if (!shouldDefaultInsertBreak) return;
      }
    }
    insertBreak();
  }

  return editor
}
