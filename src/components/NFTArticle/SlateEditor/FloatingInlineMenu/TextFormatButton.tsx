import{useSlate} from 'slate-react';
import style from "./FloatingInlineMenu.module.scss"
import {PropsWithChildren, useEffect} from 'react';
import { TextFormatKey } from '../index';
import {isFormatActive, toggleFormat, useHotkey} from '../utils';
import cx from 'classnames'

interface ITextFormatButtonProps {
  format: TextFormatKey
  hotkey?: string
}

export const TextFormatButton = ({ format, hotkey, children }: PropsWithChildren<ITextFormatButtonProps>) => {
  const editor = useSlate()

  const handleToggleFormat = () => {
    toggleFormat(editor, format)
  }

  useHotkey(hotkey, handleToggleFormat)

  return (
    <button
      className={cx(
	style.button, 
        {[style.active]: isFormatActive(editor, format)}
      )}
      onClick={handleToggleFormat}
    >
      {children}
    </button>
  )
}
