import React, { memo, MouseEventHandler, useCallback } from 'react';
import style from "./TableEditor.module.scss";
import effects from "../../../../styles/Effects.module.scss"
import Slate, { Editor } from "slate";
import { SlateTable } from "../../SlateEditor/Plugins/SlateTablePlugin";
import cs from "classnames";

type Alignment = 'left'|'center'|'right';
type ToggleColAlignment = (newAlign: Alignment) => MouseEventHandler<HTMLButtonElement>
const alignments: Alignment[] = ['left', 'center', 'right'];

interface TableColToolbarProps {
  col: number,
  row: number
  tableElement: Slate.Element
  editor: Editor
}
const _TableColToolbar = ({ col, row, editor, tableElement }: TableColToolbarProps) => {
  const { cols, rows } = SlateTable.getTableInfos(tableElement);
  const styleContainer = { left: `${col * 100 / cols}%` };
  const colAlign = tableElement.align[col];
  const handleToggleColAlignment = useCallback<ToggleColAlignment>((newAlign) => (e) => {
    e.preventDefault()
    SlateTable.setColAlignment(editor, tableElement, col, newAlign);
  }, [col, editor, tableElement])
  const handleDeleteCol = useCallback((e) => {
    e.preventDefault();
    if (cols > 1) {
      SlateTable.deleteCol(editor, tableElement, col);
    }
  }, [col, cols, editor, tableElement])
  const handleDeleteRow = useCallback((e) => {
    e.preventDefault();
    if (rows > 1) {
      SlateTable.deleteRow(editor, tableElement, row);
    }
  }, [editor, row, rows, tableElement])
  return (
    <div
      contentEditable={false}
      className={cs(style.toolbar_col, effects['drop-shadow-small'])}
      style={styleContainer}
    >
      {alignments.map((alignment) =>
        <button
          key={alignment}
          contentEditable={false}
          onMouseDown={handleToggleColAlignment(alignment)}
          type="button"
          className={cs({
            [style.active]: colAlign === alignment,
          })}
        >
          <i className={`fa-solid fa-align-${alignment}`} />
        </button>
      )}
      {cols > 1 &&
        <button
          contentEditable={false}
          onMouseDown={handleDeleteCol}
          type="button"
        >
          <i className="fa-solid fa-trash" />
          <span>Col</span>
        </button>
      }
      {rows > 1 &&
        <button
          contentEditable={false}
          onMouseDown={handleDeleteRow}
          type="button"
        >
          <i className="fa-solid fa-trash" />
          <span>Row</span>
        </button>
      }
    </div>
  );
};

export const TableColToolbar = memo(_TableColToolbar);
