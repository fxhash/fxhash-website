import React, { memo, MouseEventHandler, useCallback } from 'react';
import style from "./TableEditor.module.scss";
import Slate, { Editor } from "slate";
import { SlateTable } from "../../SlateEditor/Plugins/SlateTablePlugin";
import cs from "classnames";

type Alignment = 'left'|'center'|'right';
type ToggleColAlignment = (newAlign: Alignment) => MouseEventHandler<HTMLButtonElement>
const alignments: Alignment[] = ['left', 'center', 'right'];

interface TableColToolbarProps {
  col: number,
  tableElement: Slate.Element
  editor: Editor
}
const _TableColToolbar = ({ col, editor, tableElement }: TableColToolbarProps) => {
  const { cols } = SlateTable.getTableInfos(tableElement);
  const styleContainer = { left: `${col * 100 / cols}%` };
  const colAlign = tableElement.align[col];
  const handleToggleColAlignment = useCallback<ToggleColAlignment>((newAlign) => (e) => {
    e.preventDefault()
    SlateTable.setColAlignment(editor, tableElement, col, newAlign);
  }, [col, editor, tableElement])
  return (
    <div contentEditable={false} className={style.toolbar_col} style={styleContainer}>
      {
        alignments.map((alignment) =>
          <button
            key={alignment}
            contentEditable={false}
            onMouseDown={handleToggleColAlignment(alignment)}
            className={cs({
              [style.active]: colAlign === alignment,
            })}
          >
            <i className={`fa-solid fa-align-${alignment}`} />
          </button>
        )
      }
    </div>
  );
};

export const TableColToolbar = memo(_TableColToolbar);
