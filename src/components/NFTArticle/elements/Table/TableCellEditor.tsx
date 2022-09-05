import React, { useMemo } from 'react';
import style from "./TableEditor.module.scss"
import { ReactEditor, RenderElementProps, useSelected, useSlate } from "slate-react";
import cs from "classnames";
import { Path, Node } from "slate";

export const TableCellEditor = ({ attributes, element, children }: RenderElementProps) => {
  const editor = useSlate();
  const path = ReactEditor.findPath(editor, element);
  const isSelected = useSelected();
  const align = useMemo<'left'|'center'|'right'>(() => {
    const row = path[path.length - 1];
    const table = Path.parent(Path.parent(path));
    const nodeTable = Node.get(editor, table);
    if (nodeTable.align) return nodeTable.align[row];
    return 'left';
  }, [editor, path])
  const isHeader = useMemo(() => {
    const pathParent = Path.parent(path);
    const trIdx = pathParent[pathParent.length - 1];
    return trIdx === 0;
  }, [path])
  const Cell = isHeader ? 'th' : 'td';
  return (
    <Cell {...attributes} align={align} className={cs({
      [style.is_selected]: isSelected
    })}>
      {children}
    </Cell>
  )
}
