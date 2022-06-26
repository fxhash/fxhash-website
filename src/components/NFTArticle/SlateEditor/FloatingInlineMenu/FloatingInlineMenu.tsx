import React, { useMemo, useRef, useEffect } from 'react'
import style from "./FloatingInlineMenu.module.scss"
import effects from "../../../../styles/Effects.module.scss"
import cs from "classnames"
import ReactDOM from 'react-dom'
import { Slate, Editable, withReact, useSlate, useFocused } from 'slate-react'
import {
  Editor,
  Transforms,
  Text,
  createEditor,
  Descendant,
  Range,
} from 'slate'
import {TextFormatButton} from './TextFormatButton';
import {useClientEffect} from '../../../../utils/hookts'

const FloatingInlineMenu = () => {
  const ref = useRef<HTMLDivElement>(null)
  const editor = useSlate()
  const inFocus = useFocused()

  useClientEffect(() => {
    const el = ref.current
    const { selection } = editor

    if (!el) {
      return
    }

    if (!selection || !inFocus || Range.isCollapsed(selection) || Editor.string(editor, selection) === '') {
      el.removeAttribute('style')
      return
    }

    const domSelection = window.getSelection()
    if (!domSelection) return
    const domRange = domSelection.getRangeAt(0)
    const rect = domRange.getBoundingClientRect()
  
    el.style.opacity = "1"
    el.style.top = `${rect.top + window.pageYOffset - el.offsetHeight}px`
    el.style.left = `${rect.left + window.pageXOffset - el.offsetWidth / 2 + rect.width / 2}px`
  })

  if (typeof window === "undefined") return null

  return ReactDOM.createPortal(
    <div
      ref={ref}
      className={cs(style.menu, effects['drop-shadow-small'])}
      onMouseDown={e => {
        // prevent toolbar from taking focus away from editor
        e.preventDefault()
      }}
    >
      <TextFormatButton format="strong">
	      <i className="fa-solid fa-bold"/>
      </TextFormatButton>
      <TextFormatButton format="emphasis" >
        <i className="fa-solid fa-italic"/>
      </TextFormatButton>
      <TextFormatButton format="inlineCode">
        <i className="fa-solid fa-code" />
      </TextFormatButton>
    </div>,
    document.body
  )
}
export default FloatingInlineMenu
