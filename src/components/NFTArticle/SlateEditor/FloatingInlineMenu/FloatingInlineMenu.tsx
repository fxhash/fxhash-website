import React, { useRef, useState } from 'react'
import style from "./FloatingInlineMenu.module.scss"
import effects from "../../../../styles/Effects.module.scss"
import cs from "classnames"
import ReactDOM from 'react-dom'
import { useSlate,  useFocused } from 'slate-react'
import {
  Range,
  NodeEntry, 
} from 'slate'
import {TextFormatButton} from './TextFormatButton';
import {useClientEffect} from '../../../../utils/hookts'
import { lookupElementByType } from '../utils'; 
import { LinkButton } from './LinkButton';

const FloatingInlineMenu = () => {
  const ref = useRef<HTMLDivElement>(null)
  const editor = useSlate()
  const inFocus = useFocused()
  const [overrideContent, setOverrideContent] = useState(null)

  const activeElement = lookupElementByType(editor, 'link') as NodeEntry;
  
  useClientEffect(() => {
    const menuElement = ref.current

    if (!menuElement || !inFocus || (overrideContent && !activeElement)) return;
    
    const domSelection = window.getSelection()
    const domRange = domSelection?.getRangeAt(0)
    const rect = domRange?.getBoundingClientRect()
    if (!menuElement || !rect) return;
    menuElement.style.top = `${rect.top + window.pageYOffset - menuElement.offsetHeight}px`
    menuElement.style.left = `${rect.left + window.pageXOffset - menuElement.offsetWidth / 2 + rect.width / 2}px`
  })

  useClientEffect(() => {
    if(!activeElement) 
      setOverrideContent(null)
  }, [activeElement]);

  useClientEffect(() => {
    const menuElement = ref.current
    const { selection } = editor;
    if (!menuElement) return;
    if (activeElement || overrideContent || (selection && !Range.isCollapsed(selection))) {
      menuElement.classList.add(style.visible)
    } else {
      menuElement.classList.remove(style.visible)
    }
  }, [editor.selection, overrideContent])

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
      {(overrideContent && React.cloneElement(overrideContent, {activeElement: activeElement?.[0]})) || 
	<>
	  <TextFormatButton format="strong">
	    <i className="fa-solid fa-bold"/>
	  </TextFormatButton>
	  <TextFormatButton format="emphasis" >
	    <i className="fa-solid fa-italic"/>
	  </TextFormatButton>
	  <TextFormatButton format="inlineCode">
	    <i className="fa-solid fa-code" />
	  </TextFormatButton>
	  <LinkButton setOverrideContent={setOverrideContent} />
	</>
      }
    </div>,
    document.body
  )
}
export default FloatingInlineMenu
