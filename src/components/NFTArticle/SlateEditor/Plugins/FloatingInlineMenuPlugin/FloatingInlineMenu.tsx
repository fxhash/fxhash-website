import React, { ReactNode, useRef, useState } from 'react'
import style from "./FloatingInlineMenu.module.scss"
import effects from "../../../../../styles/Effects.module.scss"
import cs from "classnames"
import ReactDOM from 'react-dom'
import { useSlate,  useFocused } from 'slate-react'
import {
  Range,
  NodeEntry,
  Location
} from 'slate'
import {TextFormatButton} from './TextFormatButton'
import {useClientEffect} from '../../../../../utils/hookts'
import { lookupElementAtSelection, lookupElementByType } from '../../utils'
import { LinkButton } from './LinkButton'
import { BlockDefinitions, EArticleBlocks } from '../../Blocks'
import { ALL_TEXT_FORMATS } from '../../index'

export const ALL_INLINE_FORMATS  = [...ALL_TEXT_FORMATS, 'link'] as const
export type InlineServiceKey = typeof ALL_INLINE_FORMATS[number]

export type InlineServices = {[key in InlineServiceKey]: ReactNode}

const InlineMenuServices:InlineServices = {
  'strong': () => (
    <TextFormatButton format="strong" hotkey="cmd+b">
      <i className="fa-solid fa-bold"/>
    </TextFormatButton>
  ),
  'emphasis': () => (
    <TextFormatButton format="emphasis" hotkey="mod+i" >
      <i className="fa-solid fa-italic"/>
    </TextFormatButton>
  ),
  'inlineCode': () => (
    <TextFormatButton format="inlineCode" hotkey="mod+`">
      <i className="fa-solid fa-code" />
    </TextFormatButton>
  ),
  'link': ({ setOverrideContent }: {setOverrideContent: () => void})  =>
    <LinkButton setOverrideContent={setOverrideContent} />
}

const FloatingInlineMenu = () => {
  const ref = useRef<HTMLDivElement>(null)
  const editor = useSlate()
  const inFocus = useFocused()
  const [overrideContent, setOverrideContent] = useState(null)

  const [elementUnderCursor] = lookupElementAtSelection(editor, editor.selection as Location) || []

  const { inlineMenu } = BlockDefinitions[elementUnderCursor?.type as any as EArticleBlocks] || {};

  let hideFloatingInlineMenu = inlineMenu === null;

  const activeElement = lookupElementByType(editor, 'link') as NodeEntry;

  useClientEffect(() => {
    const menuElement = ref.current

    if (!menuElement || !inFocus || (overrideContent && !activeElement)) return;

    try {
      const domSelection = window.getSelection()
      const domRange = domSelection && domSelection.getRangeAt(0)
      const rect = domRange && domRange.getBoundingClientRect()
      if (!menuElement || !rect) return;
      menuElement.style.top = `${rect.top + window.pageYOffset - menuElement.offsetHeight}px`
      menuElement.style.left = `${rect.left + window.pageXOffset - menuElement.offsetWidth / 2 + rect.width / 2}px`
    } catch (e) {
      // silent
    }
    return;
  })

  useClientEffect(() => {
    if(!activeElement)
      setOverrideContent(null)
  }, [activeElement]);

  useClientEffect(() => {
    const menuElement = ref.current
    const { selection } = editor;
    if (!menuElement) return;
    if (!hideFloatingInlineMenu && (activeElement || overrideContent || (selection && !Range.isCollapsed(selection)))) {
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
        {
          Object.keys(InlineMenuServices).map((key: string) => {
            // if inlineMenu from blockdefinitions is an array we only want to allow those
            // services specified in the array
            if (Array.isArray(inlineMenu) && !inlineMenu.includes(key)) return null;
            const Service = InlineMenuServices[key as InlineServiceKey] as any;
            return (
              <Service 
                key={key}
                setOverrideContent={setOverrideContent}
              />
            )
          })
        }
      </>
      }
    </div>,
    document.body
  )
}
export default FloatingInlineMenu
