import React, { ChangeEventHandler, FocusEventHandler, memo } from 'react';
import useInit from "../../../hooks/useInit";

interface MarkdownEditorProps {
  className?: string
  value?: string
  onChange?: ChangeEventHandler<HTMLTextAreaElement>
  onBlur?: FocusEventHandler<HTMLTextAreaElement>
  placeholder?: string
  onInit?: (markdown: string) => void
}

const _MarkdownEditor = ({ className, value, onChange, onBlur, placeholder, onInit }: MarkdownEditorProps) => {
  useInit(() => {
    if (onInit) {
      onInit(value || '');
    }
  })
  return (
    <textarea
      className={className}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      placeholder={placeholder}
    />
  );
};

export const MarkdownEditor = memo(_MarkdownEditor);
