import React, { memo } from 'react';
import style from "./TableEditor.module.scss"
import { RenderElementProps } from "slate-react";
import Slate from "slate";

interface TableEditorProps {
  slateAttributes: RenderElementProps["attributes"]
  slateElement: Slate.Element
  children: any
}

const _TableEditor = ({ slateAttributes, slateElement, children }: TableEditorProps) => {
  const { align } = slateElement;
  const [head, ...body] = children;

  return (
    <div>
      <table className={style.table}>
        <thead>
          {head}
        </thead>
        <tbody>
          {body}
        </tbody>
      </table>
    </div>
  );
};

export const TableEditor = memo(_TableEditor);
