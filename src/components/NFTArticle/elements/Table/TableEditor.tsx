import React, { memo, MouseEventHandler, useCallback } from 'react';
import style from "./TableEditor.module.scss"
import { RenderElementProps, useSelected, useSlate } from "slate-react";
import Slate from "slate";
import { SlateTable } from "../../SlateEditor/Plugins/SlateTablePlugin";
import { TableColToolbar } from "./TableColToolbar";
import cs from "classnames"

interface TableEditorProps {
  slateAttributes: RenderElementProps["attributes"]
  slateElement: Slate.Element
  children: any
}

const _TableEditor = ({ slateAttributes, slateElement, children }: TableEditorProps) => {
  const editor = useSlate();
  const [head, ...body] = children;
  const isSelected = useSelected();
  const handleClickAddCol = useCallback<MouseEventHandler<HTMLButtonElement>>((e) => {
    e.preventDefault();
    SlateTable.addCol(editor, slateElement);
  }, [editor, slateElement])
  const handleClickAddRow = useCallback<MouseEventHandler<HTMLButtonElement>>((e) => {
    e.preventDefault();
    SlateTable.addRow(editor, slateElement)
  }, [editor, slateElement]);
  const selectedPos = isSelected && SlateTable.getSelectedPos(editor, slateElement);
  return (
    <div className={cs({
      [style.wrapper_selected]: isSelected
    })}>
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
              onMouseDown={handleClickAddCol}
              type="button"
            >
              <i aria-hidden className="fa-solid fa-plus"/>
            </button>
            <button
              contentEditable={false}
              className={style.add_row}
              onMouseDown={handleClickAddRow}
              type="button"
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
