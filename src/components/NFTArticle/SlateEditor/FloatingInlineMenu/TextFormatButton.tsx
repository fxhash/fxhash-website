import{useSlate} from 'slate-react';
import style from "./FloatingInlineMenu.module.scss"
import {PropsWithChildren} from 'react';
import { TextFormatKey} from '../index';
import {isFormatActive, toggleFormat} from '../utils';
import cx from 'classnames'

interface ITextFormatButtonProps {
  format: TextFormatKey
}

export const TextFormatButton = ({ format, children }: PropsWithChildren<ITextFormatButtonProps>) => {
  const editor = useSlate()
  return (
    <button
      className={cx(
	style.button, 
        {[style.active]: isFormatActive(editor, format)}
      )}
      onClick={() => toggleFormat(editor, format)}
    >
      {children}
    </button>
  )
}
