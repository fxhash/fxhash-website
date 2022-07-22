import React, { memo, useCallback } from 'react';
import style from "./TableEditor.module.scss"
import { RenderElementProps, useSelected, useSlate } from "slate-react";
import Slate from "slate";
import { SlateTable } from "../../SlateEditor/Plugins/SlateTablePlugin";
import { TableColToolbar } from "./TableColToolbar";

interface TableEditorProps {
  slateAttributes: RenderElementProps["attributes"]
  slateElement: Slate.Element
  children: any
}

const _TableEditor = ({ slateAttributes, slateElement, children }: TableEditorProps) => {
  const editor = useSlate();
  const [head, ...body] = children;
  const isSelected = useSelected();
  const handleClickAddCol = useCallback(() => {
    SlateTable.addCol(editor, slateElement);
  }, [editor, slateElement])
  const handleClickAddRow = useCallback(() =>
    SlateTable.addRow(editor, slateElement),
    [editor, slateElement]);
  const selectedPos = isSelected && SlateTable.getSelectedPos(editor, slateElement);
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
        {selectedPos &&
          <>
            <TableColToolbar
              col={selectedPos.col}
              row={selectedPos.row}
              editor={editor}
              tableElement={slateElement}
            />
          </>
        }
        {isSelected &&
          <>
            <button
              contentEditable={false}
              className={style.add_col}
              onClick={handleClickAddCol}
            >
              <i aria-hidden className="fa-solid fa-plus"/>
            </button>
            <button
              contentEditable={false}
              className={style.add_row}
              onClick={handleClickAddRow}
            >
              <i aria-hidden className="fa-solid fa-plus"/>
            </button>
          </>
        }
      </div>
    </div>
  );
};

export const TableEditor = memo(_TableEditor);
