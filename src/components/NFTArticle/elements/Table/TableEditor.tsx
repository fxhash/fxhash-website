import React, { memo, useCallback } from 'react';
import style from "./TableEditor.module.scss"
import { RenderElementProps, useSelected, useSlateStatic } from "slate-react";
import Slate from "slate";
import { SlateTable } from "../../SlateEditor/Plugins/SlateTablePlugin";

interface TableEditorProps {
  slateAttributes: RenderElementProps["attributes"]
  slateElement: Slate.Element
  children: any
}

const _TableEditor = ({ slateAttributes, slateElement, children }: TableEditorProps) => {
  const editor = useSlateStatic();
  const [head, ...body] = children;
  const isSelected = useSelected();
  const handleClickAddCol = useCallback(() => {
    SlateTable.addCol(editor, slateElement);
  }, [editor, slateElement])
  const handleClickAddRow = useCallback(() =>
    SlateTable.addRow(editor, slateElement),
    [editor, slateElement]);
  return (
    <div className={style.wrapper}>
      <div className={style.table_container}>
        <table {...slateAttributes} className={style.table}>
          <thead>
            {head}
          </thead>
          <tbody>
            {body}
          </tbody>
        </table>
        {isSelected &&
          <>
            <button
              contentEditable={false}
              className={style.add_col}
              onClick={handleClickAddCol}
            >
              +
            </button>
            <button
              contentEditable={false}
              className={style.add_row}
              onClick={handleClickAddRow}
            >
              +
            </button>
          </>
        }
      </div>
    </div>
  );
};

export const TableEditor = memo(_TableEditor);
