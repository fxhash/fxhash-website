import { EnhanceEditorWith } from "../../../../types/ArticleEditor/Editor";
import { getBlockElementAtSelection } from "../utils";

const BLOCK_TYPES_WITH_SOFT_LINEBREAK = [
  'paragraph',
  'blockquote',
  'list',
  'table',
  'heading',
]

export const withSoftBreak: EnhanceEditorWith = (editor) => {
  const { insertText, insertSoftBreak } = editor

  editor.insertSoftBreak = () => {
    if(editor.selection) {
      const [element] = getBlockElementAtSelection(editor, editor.selection)
      if (element && BLOCK_TYPES_WITH_SOFT_LINEBREAK.includes(element.type)) {
	insertText('\n')
	return true;
      }
    }
    insertSoftBreak();
  }

  return editor
}
