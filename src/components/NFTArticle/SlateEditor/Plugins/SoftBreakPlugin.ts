import { EnhanceEditorWith } from "../../../../types/ArticleEditor/Editor";

export const withSoftBreak: EnhanceEditorWith = (editor) => {
  const { insertText } = editor

  editor.insertSoftBreak = () => {
    insertText('\n')
    return true;
  }

  return editor
}
